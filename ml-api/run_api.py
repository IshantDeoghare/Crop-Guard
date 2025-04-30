# run_api.py
import uvicorn
import argparse

def main():
    parser = argparse.ArgumentParser(description="Run Plant Disease Prediction API")
    parser.add_argument("--host", default="localhost", help="Host to run the API on")
    parser.add_argument("--port", type=int, default=8000, help="Port to run the API on")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload")
    args = parser.parse_args()
    
    print(f"Starting Plant Disease Prediction API on {args.host}:{args.port}")
    print("API will load models from the 'models' directory")
    
    uvicorn.run("app:app", host=args.host, port=args.port, reload=args.reload)

if __name__ == "__main__":
    main()