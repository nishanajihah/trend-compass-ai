"""
llm_service.py - Google's Gemini API Integration Service

This file handles communication with the Gemini LLM API,
managing prompt construction, API calls, and response parsing.
"""

import os
import json
import google.generativeai as genai
from typing import Dict, Any, List, Optional
from datetime import datetime

# Initialize the Gemini API with credentials from environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set. Please set it in your .env file.")

genai.configure(api_key=GEMINI_API_KEY)

class GeminiService:
    """Service for interacting with Google's Gemini LLM API."""
    
    def __init__(self):
        """Initialize the Gemini service with model configuration."""
        self.model = genai.GenerativeModel(
            model_name="gemini-pro",  # Using Gemini Pro model
            generation_config={
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 2048,
            }
        )
    
    async def analyze_trend(self, query: str, qloo_data: Dict[str, Any], 
                          industry: Optional[str] = None, 
                          timeframe: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate trend analysis using Gemini LLM combined with Qloo data.
        
        Args:
            query: The trend or topic to analyze
            qloo_data: Cultural affinity data from Qloo API
            industry: Optional industry context
            timeframe: Optional timeframe for predictions
            
        Returns:
            Dictionary containing the analyzed trend insights
        """
        # Construct a prompt that incorporates both the user query and Qloo data
        prompt = self._build_trend_prompt(query, qloo_data, industry, timeframe)
        
        # Call the Gemini API
        response = await self._generate_content(prompt)
        
        # Process and structure the response
        return self._process_trend_response(response, query)
    
    async def generate_audience_insights(self, target_audience: str, qloo_data: Dict[str, Any],
                                       product_category: Optional[str] = None,
                                       region: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate audience insights using Gemini LLM combined with Qloo data.
        
        Args:
            target_audience: Description of the target audience
            qloo_data: Cultural affinity data from Qloo API
            product_category: Optional product category
            region: Optional geographic region
            
        Returns:
            Dictionary containing audience insights
        """
        # Construct a prompt for audience analysis
        prompt = self._build_audience_prompt(target_audience, qloo_data, product_category, region)
        
        # Call the Gemini API
        response = await self._generate_content(prompt)
        
        # Process and structure the response
        return self._process_audience_response(response, target_audience)
    
    async def _generate_content(self, prompt: str) -> str:
        """
        Call the Gemini API with the provided prompt.
        
        Args:
            prompt: The prompt to send to Gemini
            
        Returns:
            String containing the LLM response
        """
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            # Log the error and return a graceful failure message
            print(f"Error calling Gemini API: {str(e)}")
            return "Error processing request with the LLM service."
    
    def _build_trend_prompt(self, query: str, qloo_data: Dict[str, Any], 
                          industry: Optional[str], timeframe: Optional[str]) -> str:
        """
        Build a prompt for trend analysis that combines the user query with Qloo data.
        
        Args:
            query: The trend topic to analyze
            qloo_data: Cultural affinity data from Qloo
            industry: Optional industry context
            timeframe: Optional timeframe for predictions
            
        Returns:
            String containing the formatted prompt
        """
        # Format Qloo data for inclusion in the prompt
        qloo_insights = json.dumps(qloo_data, indent=2)
        
        # Build context components based on available information
        industry_context = f"Industry context: {industry}" if industry else ""
        timeframe_context = f"Timeframe: {timeframe}" if timeframe else "Timeframe: near future (6-12 months)"
        
        # Construct the complete prompt
        prompt = f"""
        You are Trend Compass, an expert trend forecasting and analysis system.
        
        TASK:
        Analyze the following trend or topic: "{query}"
        {industry_context}
        {timeframe_context}
        
        CULTURAL AFFINITY DATA FROM QLOO:
        {qloo_insights}
        
        INSTRUCTIONS:
        1. Analyze the trend considering both general trend factors and the specific cultural affinity data provided by Qloo.
        2. Provide a concise summary of the trend (2-3 sentences).
        3. Identify 4-5 key insights about this trend, with each including:
           - A clear insight title
           - A detailed explanation (2-3 sentences)
           - A confidence score (0.0-1.0)
           - Whether this insight is primarily derived from Qloo data, general knowledge, or both
        4. Provide 3 actionable recommendations for marketers or creators related to this trend.
        
        FORMAT YOUR RESPONSE AS JSON with the following structure:
        {{
          "summary": "concise trend summary",
          "insights": [
            {{
              "title": "insight title",
              "description": "detailed explanation",
              "confidence": 0.85,
              "source": "qloo|llm|combined"
            }},
            // more insights...
          ],
          "recommendations": [
            "first recommendation",
            // more recommendations...
          ]
        }}
        
        IMPORTANT: Return ONLY the JSON response, no other text.
        """
        
        return prompt
    
    def _build_audience_prompt(self, target_audience: str, qloo_data: Dict[str, Any],
                             product_category: Optional[str], region: Optional[str]) -> str:
        """
        Build a prompt for audience analysis that combines the user query with Qloo data.
        
        Args:
            target_audience: Description of the target audience
            qloo_data: Cultural affinity data from Qloo
            product_category: Optional product category
            region: Optional geographic region
            
        Returns:
            String containing the formatted prompt
        """
        # Format Qloo data for inclusion in the prompt
        qloo_insights = json.dumps(qloo_data, indent=2)
        
        # Build context components based on available information
        product_context = f"Product category: {product_category}" if product_category else ""
        region_context = f"Region: {region}" if region else ""
        
        # Construct the complete prompt
        prompt = f"""
        You are Trend Compass, an expert audience analysis system.
        
        TASK:
        Analyze the following target audience: "{target_audience}"
        {product_context}
        {region_context}
        
        CULTURAL AFFINITY DATA FROM QLOO:
        {qloo_insights}
        
        INSTRUCTIONS:
        1. Analyze the audience considering both general demographic factors and the specific cultural affinity data provided by Qloo.
        2. Provide a concise summary of the audience (2-3 sentences).
        3. Identify 4-5 key cultural affinities or preferences of this audience, with each including:
           - A clear affinity title
           - A detailed explanation (2-3 sentences)
           - A confidence score (0.0-1.0)
           - Whether this insight is primarily derived from Qloo data, general knowledge, or both
        4. Provide 3 actionable recommendations for marketing to or creating content for this audience.
        
        FORMAT YOUR RESPONSE AS JSON with the following structure:
        {{
          "summary": "concise audience summary",
          "cultural_affinities": [
            {{
              "title": "affinity title",
              "description": "detailed explanation",
              "confidence": 0.85,
              "source": "qloo|llm|combined"
            }},
            // more affinities...
          ],
          "recommendations": [
            "first recommendation",
            // more recommendations...
          ]
        }}
        
        IMPORTANT: Return ONLY the JSON response, no other text.
        """
        
        return prompt
    
    def _process_trend_response(self, response_text: str, original_query: str) -> Dict[str, Any]:
        """
        Process and structure the LLM response for trend analysis.
        
        Args:
            response_text: Raw text response from Gemini
            original_query: The original trend query
            
        Returns:
            Structured dictionary of trend analysis
        """
        try:
            # Extract JSON from the response
            response_json = json.loads(response_text)
            
            # Add metadata to the response
            result = {
                "query": original_query,
                "timestamp": datetime.now().isoformat(),
                **response_json
            }
            
            return result
        
        except Exception as e:
            # If JSON parsing fails, return a fallback response
            print(f"Error processing LLM response: {str(e)}")
            return {
                "query": original_query,
                "summary": "Unable to process the trend analysis. Please try again.",
                "timestamp": datetime.now().isoformat(),
                "insights": [],
                "recommendations": ["Please try a more specific query."]
            }
    
    def _process_audience_response(self, response_text: str, original_audience: str) -> Dict[str, Any]:
        """
        Process and structure the LLM response for audience analysis.
        
        Args:
            response_text: Raw text response from Gemini
            original_audience: The original audience description
            
        Returns:
            Structured dictionary of audience insights
        """
        try:
            # Extract JSON from the response
            response_json = json.loads(response_text)
            
            # Add metadata to the response
            result = {
                "target_audience": original_audience,
                "timestamp": datetime.now().isoformat(),
                **response_json
            }
            
            return result
        
        except Exception as e:
            # If JSON parsing fails, return a fallback response
            print(f"Error processing LLM response: {str(e)}")
            return {
                "target_audience": original_audience,
                "summary": "Unable to process the audience analysis. Please try again.",
                "timestamp": datetime.now().isoformat(),
                "cultural_affinities": [],
                "recommendations": ["Please try a more specific audience description."]
            }
