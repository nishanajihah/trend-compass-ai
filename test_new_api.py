"""
New Simple API Test - Test the Trend Compass API
Run this to check if everything works properly
"""

import asyncio
import httpx
import json

# Test both localhost addresses
TEST_URLS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

async def test_api_connection():
    """Test if API is running on either URL"""
    print("🔍 Testing API Connection...")
    
    for url in TEST_URLS:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{url}/", timeout=5.0)
                
                if response.status_code == 200:
                    print(f"✅ API is running at: {url}")
                    result = response.json()
                    print(f"   Message: {result.get('message', 'No message')}")
                    return url  # Return working URL
                else:
                    print(f"❌ {url} - Status: {response.status_code}")
                    
        except Exception as e:
            print(f"❌ {url} - Error: {str(e)}")
    
    print("❌ API is not running on any URL!")
    return None

async def test_swagger_docs(base_url):
    """Test if Swagger docs are available"""
    print(f"\n📚 Testing API Documentation at {base_url}/docs")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{base_url}/docs", timeout=5.0)
            
            if response.status_code == 200:
                print("✅ Swagger docs are available!")
                print(f"   Visit: {base_url}/docs to test the API manually")
            else:
                print(f"❌ Docs not available - Status: {response.status_code}")
                
    except Exception as e:
        print(f"❌ Docs test failed: {str(e)}")

async def test_trend_endpoint(base_url):
    """Test the trend analysis endpoint"""
    print(f"\n🔍 Testing Trend Analysis at {base_url}/api/analyze/trend")
    
    # Simple test data - keep it short!
    test_data = {
        "query": "AI trends",
        "industry": "tech",
        "timeframe": "3 months"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{base_url}/api/analyze/trend",
                json=test_data,
                timeout=30.0
            )
            
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Trend Analysis Success!")
                print(f"   Query: {result.get('query', 'Unknown')}")
                print(f"   Summary: {result.get('summary', 'No summary')[:100]}...")
                print(f"   Insights found: {len(result.get('insights', []))}")
                print(f"   Recommendations: {len(result.get('recommendations', []))}")
            else:
                print(f"❌ Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")

async def test_audience_endpoint(base_url):
    """Test the audience insights endpoint"""
    print(f"\n👥 Testing Audience Analysis at {base_url}/api/analyze/audience")
    
    # Simple test data
    test_data = {
        "target_audience": "Gen Z users",
        "product_category": "social media",
        "region": "US"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{base_url}/api/analyze/audience",
                json=test_data,
                timeout=30.0
            )
            
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Audience Analysis Success!")
                print(f"   Audience: {result.get('target_audience', 'Unknown')}")
                print(f"   Summary: {result.get('summary', 'No summary')[:100]}...")
                print(f"   Cultural affinities: {len(result.get('cultural_affinities', []))}")
                print(f"   Recommendations: {len(result.get('recommendations', []))}")
            else:
                print(f"❌ Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")

async def main():
    """Run all tests"""
    print("🚀 Trend Compass API Test - New Version")
    print("=" * 50)
    
    # Step 1: Find working API URL
    base_url = await test_api_connection()
    
    if base_url:
        # Step 2: Test documentation
        await test_swagger_docs(base_url)
        
        # Step 3: Test endpoints
        await test_trend_endpoint(base_url)
        await test_audience_endpoint(base_url)
    else:
        print("\n💡 To start the API server:")
        print("   1. Open terminal in the backend folder")
        print("   2. Run: python -m uvicorn main:app --reload --port 8000")
        print("   3. Then run this test again")
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    asyncio.run(main())
