"""
schemas.py - Pydantic Models for Request and Response Data

This file defines the data models used for validating and structuring 
requests and responses in the Trend Compass API.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TrendAnalysisRequest(BaseModel):
    """
    Model for trend analysis request from the client.
    """
    query: str = Field(
        ..., 
        description="The trend or topic to analyze",
        min_length=3,
        max_length=500
    )
    industry: Optional[str] = Field(
        None,
        description="Specific industry context for the analysis"
    )
    timeframe: Optional[str] = Field(
        None,
        description="Timeframe for trend prediction (e.g., '3 months', '1 year')"
    )
    depth: Optional[str] = Field(
        "standard",
        description="Depth of analysis: 'basic', 'standard', or 'deep'"
    )

class AudienceInsightRequest(BaseModel):
    """
    Model for audience insight request from the client.
    """
    target_audience: str = Field(
        ...,
        description="Description of the target audience",
        min_length=3,
        max_length=500
    )
    product_category: Optional[str] = Field(
        None,
        description="Product or content category"
    )
    region: Optional[str] = Field(
        None,
        description="Geographic region for audience analysis"
    )

class InsightPoint(BaseModel):
    """
    A single insight point in the analysis response.
    """
    title: str
    description: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    source: str = "combined"  # "qloo", "llm", or "combined"

class TrendAnalysisResponse(BaseModel):
    """
    Model for trend analysis response to the client.
    """
    query: str
    summary: str
    timestamp: str
    insights: List[InsightPoint]
    recommendations: List[str]
    data_sources: Dict[str, Any] = {}  # For raw data points if needed

class AudienceInsightResponse(BaseModel):
    """
    Model for audience insight response to the client.
    """
    target_audience: str
    summary: str
    timestamp: str
    cultural_affinities: List[InsightPoint]
    recommendations: List[str]
    data_sources: Dict[str, Any] = {}
