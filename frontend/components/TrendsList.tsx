import React from 'react';

interface Trend {
  name: string;
  score: number;
  source: string;
  type?: string;
}

interface TrendsListProps {
  trends: Trend[];
}

const TrendsList: React.FC<TrendsListProps> = ({ trends }) => {
  // Separate actual foods from base keywords
  const actualFoods = trends.filter(t => t.source?.includes('related'));
  const baseKeywords = trends.filter(t => !t.source?.includes('related'));

  const renderTrend = (trend: Trend, index: number) => (
    <div
      key={index}
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-lg mb-1">
            {trend.name}
          </h4>
          <p className="text-xs text-gray-500 mb-2">
            Source: {trend.source}
          </p>
        </div>
        <div className="ml-4 flex flex-col items-end">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {trend.score}
          </div>
          <span className="text-xs text-gray-400 mt-1">score</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔥</span>
        <h2 className="text-2xl font-bold text-gray-900">
          Trending Foods
        </h2>
        <span className="ml-auto bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
          {trends.length} items
        </span>
      </div>

      {trends.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🍽️</div>
          <p>No trending foods yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Actual Foods Section */}
          {actualFoods.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  ACTUAL FOODS
                </span>
                <span className="text-gray-400">({actualFoods.length})</span>
              </h3>
              <div className="space-y-3">
                {actualFoods.slice(0, 15).map(renderTrend)}
              </div>
            </div>
          )}

          {/* Base Keywords Section */}
          {baseKeywords.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  BASE KEYWORDS
                </span>
                <span className="text-gray-400">({baseKeywords.length})</span>
              </h3>
              <div className="space-y-3">
                {baseKeywords.slice(0, 10).map(renderTrend)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendsList;

