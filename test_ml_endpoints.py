"""
Quick test script for new ML endpoints
Run this to verify all ML features are working
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_endpoint(name, url, method="GET", data=None):
    """Test an API endpoint"""
    try:
        if method == "GET":
            response = requests.get(url, timeout=5)
        else:
            response = requests.post(url, json=data, timeout=5)
        
        if response.status_code == 200:
            result = response.json()
            print(f"[OK] {name}: SUCCESS")
            print(f"   Response keys: {list(result.keys())[:5]}...")
            return True
        else:
            print(f"[FAIL] {name}: FAILED (Status {response.status_code})")
            print(f"   Error: {response.text[:100]}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"[WARN] {name}: Backend not running (Connection refused)")
        return False
    except Exception as e:
        print(f"[ERROR] {name}: ERROR - {str(e)[:100]}")
        return False

def main():
    print("Testing ML Endpoints...\n")
    
    endpoints = [
        ("Temperature Forecast", f"{BASE_URL}/ml/forecast/temperature?city=Mumbai&hours_ahead=48"),
        ("Flood Forecast", f"{BASE_URL}/ml/forecast/flood?city=Mumbai&hours_ahead=72"),
        ("Energy Forecast", f"{BASE_URL}/ml/forecast/energy?city=Mumbai&hours_ahead=24"),
        ("Temperature Anomalies", f"{BASE_URL}/ml/anomalies/temperature?city=Mumbai&hours_back=48"),
        ("Rainfall Anomalies", f"{BASE_URL}/ml/anomalies/rainfall?city=Mumbai&hours_back=72"),
        ("Energy Anomalies", f"{BASE_URL}/ml/anomalies/energy?city=Mumbai&hours_back=24"),
        ("Auto Decisions", f"{BASE_URL}/ml/auto-decisions?city=Mumbai"),
        ("AI Recommendations", f"{BASE_URL}/ai/recommendations?city=Mumbai"),
        ("Carbon Calculate", f"{BASE_URL}/carbon/calculate", "POST", {
            "trees": 100,
            "reflective_paint_area": 1000,
            "green_roof_area": 500
        }),
    ]
    
    results = []
    for name, url, *rest in endpoints:
        method = rest[0] if rest else "GET"
        data = rest[1] if len(rest) > 1 else None
        success = test_endpoint(name, url, method, data)
        results.append(success)
        print()
    
    # Summary
    passed = sum(results)
    total = len(results)
    print(f"\nSummary: {passed}/{total} endpoints working")
    
    if passed == total:
        print("[SUCCESS] All ML endpoints are working!")
    elif passed > 0:
        print("[WARN] Some endpoints need attention")
    else:
        print("[ERROR] Backend may not be running. Start it with: cd backend && python -m uvicorn main:app --reload")

if __name__ == "__main__":
    main()

