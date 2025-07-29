"""
API routes - Defines the trend and audience analysis endpoints
"""

import json
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from typing import Dict, Any

from backend.models.schemas import (
    TrendAnalysisRequest,
    TrendAnalysisResponse,
    AudienceInsightRequest,
    AudienceInsightResponse,
    InsightPoint
)
from backend.services.llm_service import GeminiService
from backend.services.qloo_service import QlooService

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
        
    except Exception as e:
        # Log the error and return a user-friendly message
        print(f"Error in trend analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during trend analysis."
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
        
    except Exception as e:
        # Log the error and return a user-friendly message
        print(f"Error in audience analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during audience analysis."
        )
