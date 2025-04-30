# test_api.py
import requests
import argparse
import os
import sys

def test_endpoint(url, image_path, plant_type):
    """Test a specific plant endpoint with an image"""
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        return False
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{url}/predict/{plant_type}", files=files)
        
        if response.status_code == 200:
            print(f"Success! Response for {plant_type}:")
            print(response.json())
            return True
        else:
            print(f"Error: Received status code {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"Error making request: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Test the Plant Disease Prediction API")
    parser.add_argument("--url", default="http://localhost:8000", help="API base URL")
    parser.add_argument("--image", required=True, help="Path to the image file")
    parser.add_argument("--plant", choices=["potato", "tomato", "pepper"], required=True, 
                        help="Plant type to test")
    
    args = parser.parse_args()
    
    # First check if the API is running
    try:
        health_response = requests.get(f"{args.url}/health")
        if health_response.status_code == 200:
            print("API is running. Health check response:")
            print(health_response.json())
        else:
            print(f"Warning: Health check returned status code {health_response.status_code}")
    except Exception as e:
        print(f"Error connecting to API: {e}")
        print("Make sure the API server is running!")
        sys.exit(1)
    
    # Test the specific endpoint
    test_endpoint(args.url, args.image, args.plant)

if __name__ == "__main__":
    main()