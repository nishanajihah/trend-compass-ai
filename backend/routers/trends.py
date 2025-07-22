"""
trends.py - API Endpoints for Trend and Audience Analysis

This file defines the FastAPI endpoints that handle trend analysis
and audience insight requests, connecting the frontend to backend services.
"""

import json
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

@router.post("/analyze/trend", response_model=TrendAnalysisResponse)
async def analyze_trend(
    request: TrendAnalysisRequest,
    llm_service: GeminiService = Depends(get_llm_service),
    qloo_service: QlooService = Depends(get_qloo_service)
):
    """
    Analyze a trend using both Qloo data and LLM insights.
    
    Args:
        request: TrendAnalysisRequest with query and optional parameters
        llm_service: Injected GeminiService
        qloo_service: Injected QlooService
        
    Returns:
        TrendAnalysisResponse with combined insights
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

@router.post("/analyze/audience", response_model=AudienceInsightResponse)
async def analyze_audience(
    request: AudienceInsightRequest,
    llm_service: GeminiService = Depends(get_llm_service),
    qloo_service: QlooService = Depends(get_qloo_service)
):
    """
    Analyze an audience using both Qloo data and LLM insights.
    
    Args:
        request: AudienceInsightRequest with target audience and optional parameters
        llm_service: Injected GeminiService
        qloo_service: Injected QlooService
        
    Returns:
        AudienceInsightResponse with combined insights
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
