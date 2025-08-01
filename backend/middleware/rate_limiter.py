"""
Rate limiting middleware to prevent API abuse and control costs
"""

import time
import json
from pathlib import Path
from typing import Dict, Optional
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

class RateLimiter:
    """Simple file-based rate limiter to control API usage per IP"""
    
    def __init__(self, max_requests_per_day: int = 15):
        self.max_requests_per_day = max_requests_per_day
        self.rate_limit_file = Path(__file__).parent.parent / "rate_limits.json"
        self.ensure_rate_limit_file()
    
    def ensure_rate_limit_file(self):
        """Ensure rate limit file exists"""
        if not self.rate_limit_file.exists():
            self.rate_limit_file.write_text("{}")
    
    def get_rate_limits(self) -> Dict:
        """Get current rate limits from file"""
        try:
            with open(self.rate_limit_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def save_rate_limits(self, rate_limits: Dict):
        """Save rate limits to file"""
        try:
            with open(self.rate_limit_file, 'w') as f:
                json.dump(rate_limits, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save rate limits: {e}")
    
    def get_client_ip(self, request: Request) -> str:
        """Get client IP address"""
        # Check for forwarded headers first (for reverse proxies)
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        # Check for real IP header
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        # Fall back to direct client IP
        return request.client.host if request.client else "unknown"
    
    def is_new_day(self, last_request_time: float) -> bool:
        """Check if it's a new day since last request"""
        current_time = time.time()
        last_day = time.gmtime(last_request_time).tm_yday
        current_day = time.gmtime(current_time).tm_yday
        last_year = time.gmtime(last_request_time).tm_year
        current_year = time.gmtime(current_time).tm_year
        
        return last_year != current_year or last_day != current_day
    
    def check_rate_limit(self, request: Request) -> Optional[JSONResponse]:
        """Check if request should be rate limited"""
        client_ip = self.get_client_ip(request)
        current_time = time.time()
        
        # Load current rate limits
        rate_limits = self.get_rate_limits()
        
        # Get client data
        client_data = rate_limits.get(client_ip, {
            "requests": 0,
            "last_request": current_time
        })
        
        # Reset counter if it's a new day
        if self.is_new_day(client_data["last_request"]):
            client_data = {"requests": 0, "last_request": current_time}
        
        # Check if limit exceeded
        if client_data["requests"] >= self.max_requests_per_day:
            # Calculate time until reset (next day)
            current_day_end = time.time() + (24 * 3600 - (time.time() % (24 * 3600)))
            hours_until_reset = int((current_day_end - current_time) / 3600)
            
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"You have reached the daily limit of {self.max_requests_per_day} requests. Please try again in {hours_until_reset} hours.",
                    "requests_remaining": 0,
                    "reset_time": hours_until_reset
                }
            )
        
        # Increment counter
        client_data["requests"] += 1
        client_data["last_request"] = current_time
        
        # Save updated limits
        rate_limits[client_ip] = client_data
        self.save_rate_limits(rate_limits)
        
        # Add rate limit headers to response (will be added later)
        remaining = self.max_requests_per_day - client_data["requests"]
        
        return None  # No rate limiting needed
    
    def get_remaining_requests(self, request: Request) -> int:
        """Get remaining requests for client"""
        client_ip = self.get_client_ip(request)
        rate_limits = self.get_rate_limits()
        
        client_data = rate_limits.get(client_ip, {"requests": 0, "last_request": time.time()})
        
        # Reset if new day
        if self.is_new_day(client_data["last_request"]):
            return self.max_requests_per_day
        
        return max(0, self.max_requests_per_day - client_data["requests"])
    
    def reset_all_limits(self):
        """Reset all rate limits (for development purposes)"""
        try:
            self.save_rate_limits({})
            return True
        except Exception as e:
            print(f"Error resetting rate limits: {e}")
            return False

# Global rate limiter instance
rate_limiter = RateLimiter(max_requests_per_day=15)  # 15 requests per day per IP - Hackathon friendly!
