"""
Trends service for collecting and analyzing food trends
"""
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from food_trends_demo import FoodTrendsTracker
from backend.config import GROQ_API_KEY, SERPAPI_KEY


class TrendsService:
    """Service for handling trends collection and analysis"""
    
    def __init__(self):
        self.tracker = None
    
    def _get_tracker(self) -> FoodTrendsTracker:
        """Get or create FoodTrendsTracker instance"""
        if self.tracker is None:
            self.tracker = FoodTrendsTracker()
        return self.tracker
    
    def validate_api_keys(self) -> Dict[str, Any]:
        """
        Validate that required API keys are present
        
        Returns:
            Dict with validation result
        """
        if not GROQ_API_KEY:
            return {
                'valid': False,
                'error': 'GROQ_API_KEY not found. Get free key at: https://console.groq.com'
            }
        
        if not SERPAPI_KEY:
            return {
                'valid': False,
                'error': 'SERPAPI_KEY not found. Get free key at: https://serpapi.com/users/sign_up'
            }
        
        return {'valid': True}
    
    def extract_trending_foods(self, raw_data: List[Dict]) -> List[Dict[str, Any]]:
        """
        Extract and organize trending foods
        Prioritizes related queries (actual foods) over base keywords
        
        Args:
            raw_data: Raw data from search
            
        Returns:
            List of organized trending foods
        """
        trending_foods = []
        base_keywords = []
        
        for item in raw_data:
            food_item = {
                'name': item['keyword'],
                'score': item['interest_score'],
                'source': item['source'],
                'type': item.get('type', 'base')
            }
            
            # Separate related queries (actual foods) from base search keywords
            if 'related' in item['source']:
                trending_foods.append(food_item)
            else:
                base_keywords.append(food_item)
        
        # Sort both lists by score (highest first)
        trending_foods.sort(key=lambda x: x['score'], reverse=True)
        base_keywords.sort(key=lambda x: x['score'], reverse=True)
        
        # Prioritize actual food items, then add base keywords
        all_foods = trending_foods + base_keywords
        
        print(f"   📊 Extracted: {len(trending_foods)} actual foods + {len(base_keywords)} base keywords")
        return all_foods
    
    def collect_trends(self, keywords: List[str] = None) -> Dict[str, Any]:
        """
        Collect trending foods and generate AI insights
        
        Args:
            keywords: Optional list of keywords to search for
            
        Returns:
            Dict with collected data and AI insights
        """
        tracker = self._get_tracker()
        
        # Collect trending foods from Google Search
        print("📊 Searching Google for trending foods...")
        trending_foods_raw = tracker.get_trending_foods_from_search()
        print(f"✅ Found {len(trending_foods_raw)} trending foods from search")
        
        # Extract and organize trending foods
        trending_foods = self.extract_trending_foods(trending_foods_raw)
        print(f"🔥 Total: {len(trending_foods)} trending foods")
        
        # Analyze with Groq AI
        print("🤖 Analyzing with Groq AI...")
        analysis = tracker.analyze_with_ai(trending_foods_raw, trending_foods)
        print(f"✅ AI generated {len(analysis.get('trends', []))} product ideas")
        
        # Check for AI analysis errors
        if 'error' in analysis:
            raise Exception(f"AI Analysis failed: {analysis['error']}")
        
        # Build response
        report = {
            'raw_data': trending_foods_raw,
            'trending_foods': trending_foods,
            'ai_insights': analysis,
            'report_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return report
    
    def get_trends_summary(self, report: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get a summary of trends report
        
        Args:
            report: Full trends report
            
        Returns:
            Dict with summary information
        """
        return {
            'total_trending_foods': len(report.get('trending_foods', [])),
            'total_product_ideas': len(report.get('ai_insights', {}).get('trends', [])),
            'report_date': report.get('report_date'),
            'has_data': len(report.get('trending_foods', [])) > 0
        }

