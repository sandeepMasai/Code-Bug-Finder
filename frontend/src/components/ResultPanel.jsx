import React from 'react';

const ResultPanel = ({ errors, explanation, improvedCode, loading, error }) => {
  const getErrorIcon = (type) => {
    switch (type) {
      case 'bug':
        return '🐛';
      case 'spelling':
        return '✏️';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getErrorColor = (type) => {
    switch (type) {
      case 'bug':
        return 'text-red-400 border-red-500';
      case 'spelling':
        return 'text-orange-400 border-orange-500';
      case 'warning':
        return 'text-yellow-400 border-yellow-500';
      default:
        return 'text-blue-400 border-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-4 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-red-400 font-semibold mb-2">Error</p>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!errors || errors.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg mb-2">No issues found!</p>
          <p className="text-sm">Your code looks good. Paste code and click "Find Bugs" to analyze.</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      alert('Copied to clipboard!');
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Errors Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Issues Found ({errors.length})
          </h3>
          <div className="space-y-2">
            {errors.map((err, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${getErrorColor(err.type)} bg-gray-800/50`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{getErrorIcon(err.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">
                        Line {err.line}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300 uppercase">
                        {err.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200">{err.message}</p>
                    {err.suggestion && (
                      <div className="mt-2 p-2 bg-gray-700/50 rounded text-xs">
                        <span className="text-gray-400">Suggestion: </span>
                        <span className="text-gray-200">{err.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation Section */}
        {explanation && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Explanation</h3>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{explanation}</p>
            </div>
          </div>
        )}

        {/* Improved Code Section */}
        {improvedCode && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Improved Code</h3>
              <button
                onClick={() => copyToClipboard(improvedCode)}
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
              >
                Copy Code
              </button>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 overflow-x-auto">
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                {improvedCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPanel;

