"""
API routes - Defines the trend and audience analysis endpoints
"""

import json
import os
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from typing import Dict, Any

from models.schemas import (
    TrendAnalysisRequest,
    TrendAnalysisResponse,
    AudienceInsightRequest,
    AudienceInsightResponse,
    InsightPoint
)
from services.llm_service import GeminiService
from services.qloo_service import QlooService

# Create router
router = APIRouter(
    prefix="/api",
    tags=["trends"],
    responses={404: {"description": "Not found"}},
)

# Dependency injection for services
def get_llm_service():
    """Dependency for LLM service."""
    return GeminiService()

def get_qloo_service():
    """Dependency for Qloo service."""
    return QlooService()

@router.get(
    "/status",
    summary="🔌 API Status Check",
    description="Check the status of all external API integrations and services",
    responses={
        200: {"description": "✅ Service status information"},
        500: {"description": "⚠️ Server Error"}
    }
)
async def get_api_status(
    llm_service: GeminiService = Depends(get_llm_service),
    qloo_service: QlooService = Depends(get_qloo_service)
):
    """Get comprehensive API and service status."""
    try:
        # Check Gemini API status
        gemini_status = "available" if llm_service.use_real_api else "demo_mode"
        
        # Check Qloo API status (simplified check)
        qloo_api_key = os.getenv("QLOO_API_KEY")
        qloo_api_url = os.getenv("QLOO_API_URL", "https://hackathon.api.qloo.com")
        qloo_status = "configured" if qloo_api_key and qloo_api_key != "demo_key_for_hackathon" else "demo_mode"
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "services": {
                "gemini_llm": {
                    "status": gemini_status,
                    "description": "Google Gemini AI for trend analysis" if gemini_status == "available" else "Using demo responses (add GEMINI_API_KEY)"
                },
                "qloo_api": {
                    "status": qloo_status, 
                    "url": qloo_api_url,
                    "description": f"Qloo cultural data API at {qloo_api_url}" if qloo_status == "configured" else "Using simulated data (add QLOO_API_KEY)"
                },
                "database": {
                    "status": "not_implemented",
                    "description": "No database required for current version"
                }
            },
            "api_endpoints": {
                "trends_analyze": "/api/trends/analyze",
                "audience_analyze": "/api/audience/analyze",
                "status_check": "/api/status",
                "docs": "/docs",
                "redoc": "/redoc"
            }
        }
    except Exception as e:
        print(f"Error checking API status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Unable to check service status"
        )

@router.get(
    "/test-qloo",
    summary="🧪 Test Qloo Integration",
    description="Test the Qloo API connection with a simple query",
    responses={
        200: {"description": "✅ Qloo API test results"},
        500: {"description": "⚠️ Server Error"}
    }
)
async def test_qloo_integration(
    qloo_service: QlooService = Depends(get_qloo_service)
):
    """Test Qloo API integration with a simple query."""
    try:
        # Test with a simple trend query
        test_result = await qloo_service.get_trend_data("sustainable fashion")
        
        return {
            "status": "success",
            "message": "Qloo API integration test completed",
            "timestamp": datetime.now().isoformat(),
            "api_url": qloo_service.base_url,
            "has_real_data": "trend_strength" in test_result and "cultural_affinities" in test_result,
            "sample_data": test_result,
            "explanation": {
                "hackathon_url": "https://hackathon.api.qloo.com",
                "how_it_works": [
                    "The hackathon URL is an API endpoint, not a website",
                    "You can't access it directly in a browser",
                    "It requires proper authentication headers",
                    "Your app makes HTTP requests to it with your API key",
                    "The API returns JSON data about cultural trends and affinities"
                ],
                "example_request": f"GET {qloo_service.base_url}/cultural-affinities with Authorization header"
            }
        }
    except Exception as e:
        print(f"Error testing Qloo integration: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Qloo API test failed: {str(e)}"
        )

@router.post(
    "/trends/analyze", 
    response_model=TrendAnalysisResponse,
    summary="📊 Analyze Market Trends",
    description="""
    **Analyze any trend to get strategic insights and forecasts**
    
    🔍 **Input**: Any trend or market category (e.g., "Sustainable Fashion", "AI Technology")  
    📈 **Output**: Market insights, cultural context, and actionable recommendations
    
    **Perfect for**: Marketers, business strategists, content creators
    """,
    responses={
        200: {"description": "✅ Success - Comprehensive trend analysis"},
        400: {"description": "❌ Bad Request - Check your input"},
        500: {"description": "⚠️ Server Error - Try again later"}
    }
)
async def analyze_trend(
    request: TrendAnalysisRequest,
    llm_service: GeminiService = Depends(get_llm_service),
    qloo_service: QlooService = Depends(get_qloo_service)
):
    """
    Analyze trends with AI-powered insights and cultural context.
    """
    try:
        # Step 1: Get cultural affinity data from Qloo
        qloo_data = await qloo_service.get_trend_data(
            query=request.query,
            industry=request.industry
        )
        
        # Step 2: Process with LLM for insights
        llm_result = await llm_service.analyze_trend(
            query=request.query,
            qloo_data=qloo_data,
            industry=request.industry,
            timeframe=request.timeframe
        )
        
        # Step 3: Return the combined result
        return TrendAnalysisResponse(
            query=request.query,
            summary=llm_result.get("summary", "Analysis not available"),
            timestamp=datetime.now().isoformat(),
            insights=llm_result.get("insights", []),
            recommendations=llm_result.get("recommendations", []),
            data_sources={"qloo": qloo_data}
        )
        
    except ValueError as e:
        # Handle validation errors
        print(f"Validation error in trend analysis: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid input: {str(e)}"
        )
    except ConnectionError as e:
        # Handle API connection errors
        print(f"Connection error in trend analysis: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to external services. Please try again later."
        )
    except Exception as e:
        # Log the error and return a user-friendly message
        print(f"Unexpected error in trend analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during trend analysis. Our team has been notified."
        )

@router.post(
    "/audience/analyze", 
    response_model=AudienceInsightResponse,
    summary="👥 Deep Audience Insights",
    description="""
    **Understand your target audience with cultural intelligence**
    
    🎯 **Input**: Describe your audience (e.g., "Gen Z music lovers", "Tech millennials")  
    🧠 **Output**: Cultural preferences, behaviors, and engagement strategies
    
    **Perfect for**: Marketing teams, product managers, brand strategists
    """,
    responses={
        200: {"description": "✅ Success - Deep audience insights"},
        400: {"description": "❌ Bad Request - Provide clear audience description"},
        500: {"description": "⚠️ Server Error - Try again later"}
    }
)
async def analyze_audience(
    request: AudienceInsightRequest,
    llm_service: GeminiService = Depends(get_llm_service),
    qloo_service: QlooService = Depends(get_qloo_service)
):
    """
    Analyze audiences with cultural affinity data and behavioral insights.
    """
    try:
        # Step 1: Get cultural affinity data from Qloo
        qloo_data = await qloo_service.get_audience_data(
            audience=request.target_audience,
            product_category=request.product_category,
            region=request.region
        )
        
        # Step 2: Process with LLM for insights
        llm_result = await llm_service.generate_audience_insights(
            target_audience=request.target_audience,
            qloo_data=qloo_data,
            product_category=request.product_category,
            region=request.region
        )
        
        # Step 3: Return the combined result
        return AudienceInsightResponse(
            target_audience=request.target_audience,
            summary=llm_result.get("summary", "Analysis not available"),
            timestamp=datetime.now().isoformat(),
            cultural_affinities=llm_result.get("cultural_affinities", []),
            recommendations=llm_result.get("recommendations", []),
            data_sources={"qloo": qloo_data}
        )
        
    except ValueError as e:
        # Handle validation errors
        print(f"Validation error in audience analysis: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid input: {str(e)}"
        )
    except ConnectionError as e:
        # Handle API connection errors
        print(f"Connection error in audience analysis: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to external services. Please try again later."
        )
    except Exception as e:
        # Log the error and return a user-friendly message
        print(f"Unexpected error in audience analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during audience analysis. Our team has been notified."
        )
