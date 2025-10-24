"""
Cache service for managing trends data cache
"""
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

from backend.config import CACHE_FILE


class CacheService:
    """Service for managing cache operations"""
    
    def __init__(self, cache_file: Path = CACHE_FILE):
        self.cache_file = cache_file
    
    def load(self) -> Optional[Dict[str, Any]]:
        """
        Load cached data from file
        
        Returns:
            Dict with cache data if valid and from today, None otherwise
        """
        try:
            if not self.cache_file.exists():
                return None
            
            with open(self.cache_file, 'r') as f:
                cache = json.load(f)
            
            # Check if cache is from today
            cache_date = datetime.fromisoformat(cache.get('timestamp', ''))
            if cache_date.date() == datetime.now().date():
                print(f"📦 Loaded cache from: {cache_date.strftime('%Y-%m-%d %H:%M:%S')}")
                return cache
            else:
                print(f"⏰ Cache is old (from {cache_date.date()}), needs refresh")
                return None
                
        except Exception as e:
            print(f"⚠️ Cache load error: {e}")
            return None
    
    def save(self, data: Dict[str, Any]) -> bool:
        """
        Save data to cache file
        
        Args:
            data: Data to cache
            
        Returns:
            True if successful, False otherwise
        """
        try:
            cache_data = {
                'timestamp': datetime.now().isoformat(),
                'data': data
            }
            
            with open(self.cache_file, 'w') as f:
                json.dump(cache_data, f, indent=2)
            
            print(f"💾 Cache saved at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            return True
            
        except Exception as e:
            print(f"⚠️ Cache save error: {e}")
            return False
    
    def get_status(self) -> Dict[str, Any]:
        """
        Get cache status
        
        Returns:
            Dict with cache status information
        """
        cached_data = self.load()
        
        if cached_data:
            cache_date = datetime.fromisoformat(cached_data['timestamp'])
            return {
                'success': True,
                'cached': True,
                'cache_date': cache_date.strftime('%Y-%m-%d %H:%M:%S'),
                'is_today': cache_date.date() == datetime.now().date(),
                'trending_foods_count': len(cached_data['data'].get('trending_foods', []))
            }
        else:
            return {
                'success': True,
                'cached': False,
                'message': 'No cache available'
            }
    
    def clear(self) -> bool:
        """
        Clear cache file
        
        Returns:
            True if successful, False otherwise
        """
        try:
            if self.cache_file.exists():
                self.cache_file.unlink()
                print("🗑️ Cache cleared")
            return True
        except Exception as e:
            print(f"⚠️ Cache clear error: {e}")
            return False

