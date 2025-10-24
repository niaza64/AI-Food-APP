import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes for long-running operations
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TrendItem {
  name: string;
  score: number;
  source: string;
  type?: string;
}

export interface ProductIdea {
  name: string;
  category: string;
  description: string;
  innovation_potential: string;
  target_market: string;
  product_ideas: string[];
}

export interface TrendsResponse {
  success: boolean;
  cached?: boolean;
  trending_foods: TrendItem[];
  trends?: ProductIdea[];
  ai_insights?: {
    summary: string;
    trends: ProductIdea[];
  };
  report_date: string;
  error?: string;
}

export interface CacheStatusResponse {
  success: boolean;
  cached: boolean;
  cache_date?: string;
  is_today?: boolean;
  trending_foods_count?: number;
  message?: string;
}

/**
 * Check if backend is healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await api.get('/api/health');
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

/**
 * Collect new trends data
 */
export async function collectTrends(forceRefresh = false): Promise<TrendsResponse> {
  try {
    const response = await api.post('/api/collect-trends', {
      force_refresh: forceRefresh,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.error || 'Failed to collect trends');
    }
    throw new Error(error.message || 'Network error');
  }
}

/**
 * Fetch existing trends data
 */
export async function fetchTrends(): Promise<TrendsResponse> {
  try {
    const response = await api.get('/api/trends');
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'No data available');
    }
    throw new Error('Failed to fetch trends');
  }
}

/**
 * Get latest report
 */
export async function getLatestReport(): Promise<TrendsResponse> {
  try {
    const response = await api.get('/api/latest-report');
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'No report available');
    }
    throw new Error('Failed to fetch report');
  }
}

/**
 * Get cache status
 */
export async function getCacheStatus(): Promise<CacheStatusResponse> {
  try {
    const response = await api.get('/api/cache/status');
    return response.data;
  } catch (error) {
    console.error('Failed to get cache status:', error);
    return { success: false, cached: false };
  }
}

/**
 * Clear cache
 */
export async function clearCache(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post('/api/cache/clear');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to clear cache');
  }
}

export default api;

