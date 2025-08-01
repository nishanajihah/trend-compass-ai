"""
Test script to verify rate limiting works correctly
This script will make 4 requests to test the 3-request limit
"""

import requests
import json
import time

API_BASE_URL = "http://localhost:8000"

def test_rate_limiting():
    print("🧪 Testing Rate Limiting (3 requests per day)")
    print("=" * 50)
    
    # Test payload
    test_data = {
        "query": "AI trends test",
        "industry": "Technology",
        "timeframe": "6 months"
    }
    
    for i in range(1, 5):  # Try 4 requests (should fail on 4th)
        print(f"\n📡 Request #{i}")
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/api/trends/analyze",
                json=test_data,
                timeout=30
            )
            
            print(f"Status Code: {response.status_code}")
            
            # Print rate limit headers if present
            if 'X-RateLimit-Limit' in response.headers:
                limit = response.headers['X-RateLimit-Limit']
                remaining = response.headers['X-RateLimit-Remaining']
                print(f"Rate Limit: {remaining}/{limit} requests remaining")
            
            if response.status_code == 200:
                print("✅ Request successful")
                data = response.json()
                print(f"Summary: {data.get('summary', 'No summary')[:100]}...")
                
            elif response.status_code == 429:
                print("🚫 Rate limit exceeded!")
                error_data = response.json()
                print(f"Error: {error_data.get('message', 'Rate limit exceeded')}")
                print(f"Reset Time: {error_data.get('reset_time', 'Unknown')} hours")
                break
                
            else:
                print(f"❌ Request failed: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error: {error_data}")
                except:
                    print(f"Error: {response.text}")
                    
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
            break
        
        # Small delay between requests
        if i < 4:
            time.sleep(1)
    
    print("\n" + "=" * 50)
    print("🏁 Rate limiting test completed")

if __name__ == "__main__":
    test_rate_limiting()
