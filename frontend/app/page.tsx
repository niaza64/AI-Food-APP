'use client';

import { useState, useEffect } from 'react';
import { fetchTrends, collectTrends, getCacheStatus } from '@/lib/api';
import TrendsList from '@/components/TrendsList';
import ProductIdeas from '@/components/ProductIdeas';
import LoadingSpinner from '@/components/LoadingSpinner';

interface CacheStatus {
  cached: boolean;
  cache_date?: string;
  is_today?: boolean;
  trending_foods_count?: number;
}

export default function Home() {
  const [trends, setTrends] = useState<any[]>([]);
  const [productIdeas, setProductIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportDate, setReportDate] = useState<string>('');
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null);

  // Check cache on mount
  useEffect(() => {
    checkCache();
    loadExistingData();
  }, []);

  const checkCache = async () => {
    try {
      const status = await getCacheStatus();
      setCacheStatus(status);
    } catch (err) {
      console.error('Error checking cache:', err);
    }
  };

  const loadExistingData = async () => {
    try {
      const data = await fetchTrends();
      if (data.success) {
        setTrends(data.trending_foods || []);
        setProductIdeas(data.trends || []);
        setReportDate(data.report_date || '');
      }
    } catch (err) {
      console.log('No existing data to load');
    }
  };

  const handleCollectTrends = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await collectTrends(forceRefresh);
      
      if (data.success) {
        setTrends(data.trending_foods || []);
        setProductIdeas(data.ai_insights?.trends || []);
        setReportDate(data.report_date || '');
        await checkCache();
      } else {
        setError(data.error || 'Failed to collect trends');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while collecting trends');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                🍔 Food Trends Tracker
              </h1>
              <p className="mt-2 text-gray-600">
                AI-powered analysis of trending foods and flavors
              </p>
            </div>
            
            {cacheStatus && cacheStatus.cached && (
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Cache: {cacheStatus.is_today ? '✅ Today' : '⚠️ Old'}
                </div>
                <div className="text-xs text-gray-400">
                  {cacheStatus.cache_date}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Discover Trends
              </h2>
              <p className="text-gray-600 text-sm">
                Search Google for trending foods and generate AI-powered product ideas
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleCollectTrends(false)}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {loading ? 'Collecting...' : '🔍 Discover Trends'}
              </button>
              
              {cacheStatus?.cached && (
                <button
                  onClick={() => handleCollectTrends(true)}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  🔄 Force Refresh
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <h3 className="font-semibold mb-1">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Report Date */}
        {reportDate && !loading && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Report generated: <span className="font-semibold">{reportDate}</span>
            </p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && (trends.length > 0 || productIdeas.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trending Foods */}
            <TrendsList trends={trends} />

            {/* AI Product Ideas */}
            <ProductIdeas ideas={productIdeas} />
          </div>
        )}

        {/* Empty State */}
        {!loading && trends.length === 0 && productIdeas.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Data Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Click "Discover Trends" to start analyzing food trends
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Powered by Google Search API and Groq AI</p>
        </div>
      </footer>
    </div>
  );
}

