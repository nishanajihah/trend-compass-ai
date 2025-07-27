"""
Qloo API service - Gets cultural data from Qloo
"""

import os
import httpx
import json
from pathlib import Path
from dotenv import load_dotenv
from typing import Dict, Any, Optional

# Load environment variables from .env file in parent directory
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Get Qloo settings from environment
QLOO_API_KEY = os.getenv("QLOO_API_KEY")
QLOO_API_URL = os.getenv("QLOO_API_URL", "https://hackathon.api.qloo.com")

if not QLOO_API_KEY:
    raise ValueError("QLOO_API_KEY not found in .env file!")

class QlooService:
    """Service for interacting with the Qloo cultural affinity API."""
    
    def __init__(self):
        """Initialize the Qloo service with API configuration."""
        self.api_key = QLOO_API_KEY
        self.base_url = QLOO_API_URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    async def get_trend_data(self, query: str, industry: Optional[str] = None) -> Dict[str, Any]:
        """Get trend data from Qloo API"""
        try:
            # Call the actual Qloo API
            endpoint = f"{self.base_url}/trends/analyze"
            
            # Prepare the request data
            request_data = {"query": query}
            if industry:
                request_data["industry"] = industry
                
            # Make the API call
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    endpoint,
                    headers=self.headers,
                    json=request_data,
                    timeout=30.0
                )
                
                # Log the request for debugging
                print(f"Qloo API request to {endpoint}: {request_data}")
                
                # Process the response
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"Qloo API error: {response.status_code} - {response.text}")
                    # Fall back to simulated data if API call fails
                    return self._get_fallback_trend_data(query)
                    
        except Exception as e:
            # Log the error and fall back to simulated data
            print(f"Error calling Qloo API: {str(e)}")
            return self._get_fallback_trend_data(query)
    
    async def get_audience_data(self, audience: str, product_category: Optional[str] = None,
                              region: Optional[str] = None) -> Dict[str, Any]:
        """Get audience insights data from Qloo API"""
        try:
            # Call the actual Qloo API
            endpoint = f"{self.base_url}/audiences/analyze"
            
            # Prepare the request data
            request_data = {"audience": audience}
            if product_category:
                request_data["product_category"] = product_category
            if region:
                request_data["region"] = region
                
            # Make the API call
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    endpoint,
                    headers=self.headers,
                    json=request_data,
                    timeout=30.0
                )
                
                # Log the request for debugging
                print(f"Qloo API request to {endpoint}: {request_data}")
                
                # Process the response
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"Qloo API error: {response.status_code} - {response.text}")
                    # Fall back to simulated data if API call fails
                    return self._get_fallback_audience_data(audience)
                    
        except Exception as e:
            # Log the error and fall back to simulated data
            print(f"Error calling Qloo API: {str(e)}")
            return self._get_fallback_audience_data(audience)
    
    def _get_simulated_trend_data(self, query: str, industry: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate simulated Qloo API data for trend analysis.
        
        Args:
            query: The trend or topic
            industry: Optional industry context
            
        Returns:
            Simulated cultural affinity data
        """
        # This is a simplified simulation for the hackathon prototype
        # In a real implementation, this would be actual data from Qloo API
        
        # Generate data based on the query topic for more realistic simulation
        query_lower = query.lower()
        
        # Different simulated data based on query keywords
        if "fashion" in query_lower or "clothing" in query_lower or "apparel" in query_lower:
            return {
                "trend_strength": 0.85,
                "cultural_affinities": [
                    {"domain": "Music", "entities": ["Alternative R&B", "Bedroom Pop", "Korean Hip Hop"], "strength": 0.78},
                    {"domain": "Media", "entities": ["TikTok", "Instagram Reels", "YouTube Shorts"], "strength": 0.92},
                    {"domain": "Values", "entities": ["Sustainability", "Individuality", "Global Citizenship"], "strength": 0.81},
                ],
                "regional_variations": [
                    {"region": "North America", "strength": 0.88, "notable_difference": "Higher focus on sustainability"},
                    {"region": "Europe", "strength": 0.79, "notable_difference": "Greater emphasis on timeless design"},
                    {"region": "Asia", "strength": 0.93, "notable_difference": "Faster adoption cycle, digital-first discovery"}
                ],
                "related_concepts": ["Upcycling", "Digital Fashion", "Gender-Neutral Design", "Micro-Seasons"]
            }
            
        elif "tech" in query_lower or "technology" in query_lower or "digital" in query_lower:
            return {
                "trend_strength": 0.91,
                "cultural_affinities": [
                    {"domain": "Media", "entities": ["Tech Podcasts", "YouTube Reviews", "Tech Forums"], "strength": 0.87},
                    {"domain": "Values", "entities": ["Innovation", "Efficiency", "Privacy"], "strength": 0.84},
                    {"domain": "Activities", "entities": ["Gaming", "Remote Work", "DIY Electronics"], "strength": 0.79},
                ],
                "regional_variations": [
                    {"region": "North America", "strength": 0.85, "notable_difference": "Early adoption focus"},
                    {"region": "Europe", "strength": 0.82, "notable_difference": "Greater regulatory awareness"},
                    {"region": "Asia", "strength": 0.94, "notable_difference": "Integration with daily lifestyle"}
                ],
                "related_concepts": ["AI Ethics", "Digital Wellness", "Tech Minimalism", "Sustainable Tech"]
            }
            
        elif "food" in query_lower or "culinary" in query_lower or "cuisine" in query_lower:
            return {
                "trend_strength": 0.83,
                "cultural_affinities": [
                    {"domain": "Media", "entities": ["Food Blogs", "Instagram", "TikTok Recipes"], "strength": 0.89},
                    {"domain": "Values", "entities": ["Authenticity", "Sustainability", "Wellness"], "strength": 0.85},
                    {"domain": "Activities", "entities": ["Home Cooking", "Farmers Markets", "Food Tourism"], "strength": 0.91},
                ],
                "regional_variations": [
                    {"region": "North America", "strength": 0.82, "notable_difference": "Fusion experimentation"},
                    {"region": "Europe", "strength": 0.87, "notable_difference": "Heritage preservation focus"},
                    {"region": "Asia", "strength": 0.90, "notable_difference": "Digital food community engagement"}
                ],
                "related_concepts": ["Plant-Based Innovation", "Hyper-Local Sourcing", "Food Waste Reduction", "Ghost Kitchens"]
            }
            
        else:
            # Generic trend data for any other category
            return {
                "trend_strength": 0.75,
                "cultural_affinities": [
                    {"domain": "Media", "entities": ["Social Media", "Streaming Content", "Podcasts"], "strength": 0.82},
                    {"domain": "Values", "entities": ["Authenticity", "Community", "Sustainability"], "strength": 0.79},
                    {"domain": "Activities", "entities": ["Content Creation", "Online Communities", "Skill Development"], "strength": 0.76},
                ],
                "regional_variations": [
                    {"region": "North America", "strength": 0.77, "notable_difference": "Early mainstream adoption"},
                    {"region": "Europe", "strength": 0.74, "notable_difference": "Traditional-modern integration"},
                    {"region": "Asia", "strength": 0.81, "notable_difference": "Digital-first engagement"}
                ],
                "related_concepts": ["Community Building", "Digital Transformation", "Personalization", "Micro-Trends"]
            }
    
    def _get_simulated_audience_data(self, audience: str, product_category: Optional[str] = None,
                                   region: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate simulated Qloo API data for audience analysis.
        
        Args:
            audience: Description of the target audience
            product_category: Optional product category
            region: Optional geographic region
            
        Returns:
            Simulated audience affinity data
        """
        # This is a simplified simulation for the hackathon prototype
        # In a real implementation, this would be actual data from Qloo API
        
        # Generate data based on audience keywords for more realistic simulation
        audience_lower = audience.lower()
        
        # Different simulated data based on audience keywords
        if "gen z" in audience_lower or "young" in audience_lower or "teen" in audience_lower:
            return {
                "audience_size_estimate": "Large",
                "cultural_affinities": {
                    "music": ["Hip Hop", "Hyperpop", "Indie Pop", "K-Pop"],
                    "media": ["TikTok", "YouTube", "Twitch", "Discord"],
                    "brands": ["Nike", "Glossier", "The Ordinary", "Crocs"],
                    "activities": ["Social Media Content Creation", "Gaming", "Thrifting", "Social Activism"]
                },
                "content_preferences": {
                    "format": ["Short-form video", "Memes", "Interactive", "Audio"],
                    "tone": ["Authentic", "Humorous", "Direct", "Educational"],
                    "values": ["Inclusivity", "Sustainability", "Transparency", "Social Justice"]
                },
                "purchase_drivers": ["Peer Recommendation", "Brand Values", "Social Media Presence", "Uniqueness"],
                "emerging_interests": ["Virtual Fashion", "Creator Economy", "Plant-Based Products", "Mental Health Advocacy"]
            }
            
        elif "millennial" in audience_lower or "30" in audience_lower or "young professional" in audience_lower:
            return {
                "audience_size_estimate": "Very Large",
                "cultural_affinities": {
                    "music": ["Indie Rock", "90s Nostalgia", "Electronic", "Folk Pop"],
                    "media": ["Instagram", "Podcasts", "Netflix", "Newsletter Subscriptions"],
                    "brands": ["Patagonia", "Apple", "Trader Joe's", "Allbirds"],
                    "activities": ["Home Improvement", "Fitness Classes", "Cooking", "Travel"]
                },
                "content_preferences": {
                    "format": ["Long-form articles", "Podcasts", "Curated newsletters", "Documentary-style"],
                    "tone": ["Informative", "Nostalgic", "Witty", "Practical"],
                    "values": ["Work-Life Balance", "Wellness", "Sustainability", "Financial Security"]
                },
                "purchase_drivers": ["Quality", "Convenience", "Ethical Production", "Status Signaling"],
                "emerging_interests": ["Home Ownership Alternatives", "Career Pivots", "Plant Parenthood", "Wellness Tech"]
            }
            
        elif "senior" in audience_lower or "boomer" in audience_lower or "older" in audience_lower:
            return {
                "audience_size_estimate": "Medium-Large",
                "cultural_affinities": {
                    "music": ["Classic Rock", "Jazz", "Classical", "Folk"],
                    "media": ["Facebook", "Cable News", "YouTube", "Print Media"],
                    "brands": ["Land's End", "Costco", "Subaru", "Apple"],
                    "activities": ["Gardening", "Travel", "Family Activities", "Reading"]
                },
                "content_preferences": {
                    "format": ["Detailed articles", "How-to guides", "Videos with captions", "Email newsletters"],
                    "tone": ["Respectful", "Clear", "Non-patronizing", "Expert"],
                    "values": ["Reliability", "Value", "Tradition", "Practicality"]
                },
                "purchase_drivers": ["Reliability", "Customer Service", "Familiarity", "Value for Money"],
                "emerging_interests": ["Health Tech", "Multi-generational Travel", "Encore Careers", "Digital Connectivity"]
            }
            
        else:
            # Generic audience data for any other audience description
            return {
                "audience_size_estimate": "Medium",
                "cultural_affinities": {
                    "music": ["Pop", "Rock", "R&B", "Indie"],
                    "media": ["Social Media", "Streaming Services", "News Sites", "Blogs"],
                    "brands": ["Amazon", "Target", "Nike", "Apple"],
                    "activities": ["Social Media", "Entertainment", "Shopping", "Dining"]
                },
                "content_preferences": {
                    "format": ["Video", "Images with text", "Articles", "Interactive"],
                    "tone": ["Conversational", "Authentic", "Clear", "Engaging"],
                    "values": ["Convenience", "Quality", "Affordability", "Innovation"]
                },
                "purchase_drivers": ["Price", "Convenience", "Recommendations", "Brand Reputation"],
                "emerging_interests": ["Digital Wellness", "Sustainable Products", "Personalization", "Community Connection"]
            }
    
    def _get_fallback_trend_data(self, query: str) -> Dict[str, Any]:
        """
        Provide fallback data when the Qloo API call fails.
        
        Args:
            query: The trend or topic
            
        Returns:
            Minimal fallback data
        """
        return {
            "trend_strength": 0.5,
            "cultural_affinities": [],
            "regional_variations": [],
            "related_concepts": [],
            "note": "Limited data available. This is fallback data due to API unavailability."
        }
    
    def _get_fallback_audience_data(self, audience: str) -> Dict[str, Any]:
        """
        Provide fallback data when the Qloo API call fails.
        
        Args:
            audience: Description of the target audience
            
        Returns:
            Minimal fallback data
        """
        return {
            "audience_size_estimate": "Unknown",
            "cultural_affinities": {},
            "content_preferences": {},
            "purchase_drivers": [],
            "emerging_interests": [],
            "note": "Limited data available. This is fallback data due to API unavailability."
        }
