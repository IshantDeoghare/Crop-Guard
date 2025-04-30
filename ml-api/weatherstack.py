import requests
from datetime import date, timedelta

API_KEY = "4dc6f4c2e93e42bf9a4165735251804"   # Replace with your WeatherAPI.com key
BASE_URL = "http://api.weatherapi.com/v1"
LOCATION = "Nagpur"           # Or any "City" or "Lat,Lon"

def get_current():
    """Fetch only temp_c, humidity, and precip_mm from /current.json"""
    resp = requests.get(f"{BASE_URL}/current.json", params={
        "key": API_KEY,
        "q": LOCATION,
        "aqi": "no"
    })
    data = resp.json()
    cur = data["current"]
    return {
        "date": data["location"]["localtime"].split(" ")[0],
        "temp_c": cur["temp_c"],
        "humidity": cur["humidity"],
        "precip_mm": cur["precip_mm"]
    }

def get_historical(days=7):
    """Fetch only the same three fields for the past `days` days via /history.json"""
    history = {}
    today = date.today()
    for i in range(1, days+1):
        d = today - timedelta(days=i)
        resp = requests.get(f"{BASE_URL}/history.json", params={
            "key": API_KEY,
            "q": LOCATION,
            "dt": d.strftime("%Y-%m-%d")
        })
        js = resp.json()
        day = js["forecast"]["forecastday"][0]["day"]
        history[js["forecast"]["forecastday"][0]["date"]] = {
            "maxtemp_c": day["maxtemp_c"],
            "mintemp_c": day["mintemp_c"],
            "avgtemp_c": day["avgtemp_c"],
            "avghumidity": day["avghumidity"],
            "totalprecip_mm": day["totalprecip_mm"]
        }
    return history

def get_forecast(days_ahead=3):
    """Fetch only the three fields for today + next `days_ahead` days via /forecast.json"""
    resp = requests.get(f"{BASE_URL}/forecast.json", params={
        "key": API_KEY,
        "q": LOCATION,
        "days": days_ahead + 1,
        "aqi": "no",
        "alerts": "no"
    })
    js = resp.json()
    out = {}
    for entry in js["forecast"]["forecastday"]:
        d = entry["date"]
        day = entry["day"]
        out[d] = {
            "maxtemp_c": day["maxtemp_c"],
            "mintemp_c": day["mintemp_c"],
            "avgtemp_c": day["avgtemp_c"],
            "avghumidity": day["avghumidity"],
            "totalprecip_mm": day["totalprecip_mm"]
        }
    return out

if __name__ == "__main__":
    print("=== Current ===")
    print(get_current())

    print("\n=== Past 7 Days ===")
    hist = get_historical(7)
    for dt, info in hist.items():
        print(dt, info)

    print("\n=== Next 3 Days ===")
    fcast = get_forecast(3)
    for dt, info in fcast.items():
        print(dt, info)
