import requests

API_KEY = "5d52542dbe2e7903a923f210cbde21eb"
URL = "https://gnews.io/api/v4/search"

params = {
    "q": "agriculture",
    "lang": "en",
    "country": "in",
    "token": API_KEY
}

resp = requests.get(URL, params=params)
print(resp.json())
