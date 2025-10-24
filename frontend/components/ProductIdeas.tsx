import React from 'react';

interface ProductIdea {
  name: string;
  category: string;
  description: string;
  innovation_potential: string;
  target_market: string;
  product_ideas: string[];
}

interface ProductIdeasProps {
  ideas: ProductIdea[];
}

const ProductIdeas: React.FC<ProductIdeasProps> = ({ ideas }) => {
  const getPotentialColor = (potential: string) => {
    const p = potential.toLowerCase();
    if (p === 'high') return 'bg-green-100 text-green-800 border-green-200';
    if (p === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPotentialEmoji = (potential: string) => {
    const p = potential.toLowerCase();
    if (p === 'high') return '🚀';
    if (p === 'medium') return '⭐';
    return '💡';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">💡</span>
        <h2 className="text-2xl font-bold text-gray-900">
          AI Product Ideas
        </h2>
        <span className="ml-auto bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
          {ideas.length} trends
        </span>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">🤖</div>
          <p>No AI insights yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors bg-gradient-to-br from-white to-purple-50"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {idea.name}
                    </h3>
                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {idea.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {idea.description}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full border ${getPotentialColor(idea.innovation_potential)}`}>
                  {getPotentialEmoji(idea.innovation_potential)} {idea.innovation_potential} Potential
                </span>
                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                  🎯 {idea.target_market}
                </span>
              </div>

              {/* Product Ideas */}
              {idea.product_ideas && idea.product_ideas.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Product Concepts:
                  </h4>
                  <ul className="space-y-2">
                    {idea.product_ideas.map((product, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-purple-500 font-bold mt-1">•</span>
                        <span className="flex-1">{product}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductIdeas;

