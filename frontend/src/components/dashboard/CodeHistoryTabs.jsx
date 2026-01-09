import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const CodeHistoryTabs = ({ onLoadCode, token }) => {
  const [codeHistories, setCodeHistories] = useState([]);
  const [filteredHistories, setFilteredHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  useEffect(() => {
    filterHistories();
  }, [codeHistories, searchQuery, selectedLanguage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.HISTORY.ALL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const histories = response.data.codeHistories || response.data.history || [];
        setCodeHistories(histories);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filterHistories = () => {
    let filtered = [...codeHistories];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((history) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          history.title?.toLowerCase().includes(searchLower) ||
          history.originalCode?.toLowerCase().includes(searchLower) ||
          history.language?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter((history) => history.language === selectedLanguage);
    }

    setFilteredHistories(filtered);
  };

  const handleLoadCode = (history) => {
    onLoadCode({
      originalCode: history.originalCode,
      improvedCode: history.improvedCode,
      language: history.language,
      preference: history.preference,
      errors: history.errors || [],
      explanation: history.explanation,
    });
  };

  const handleDelete = async (e, historyId) => {
    e.stopPropagation(); // Prevent triggering the parent onClick

    if (!window.confirm('Are you sure you want to delete this code history?')) {
      return;
    }

    try {
      await axios.delete(API_ENDPOINTS.HISTORY.DELETE(historyId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the history list
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete history');
    }
  };

  const handleEdit = (e, history) => {
    e.stopPropagation();
    handleLoadCode(history);
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getLanguageIcon = (language) => {
    const icons = {
      JavaScript: 'JS',
      Python: 'PY',
      Java: 'JA',
      React: '⚛️',
      'Node.js': 'N',
    };
    return icons[language] || '📄';
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Python: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      Java: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      React: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Node.js': 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[language] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const uniqueLanguages = [...new Set(codeHistories.map((h) => h.language).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-700 border-t-blue-500 mb-4"></div>
        <p className="text-gray-400 text-sm">Loading your code history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center space-x-2 text-red-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (codeHistories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No code history yet</h3>
        <p className="text-sm text-gray-400 text-center max-w-sm">
          Your saved code analyses will appear here. Start analyzing code to build your history!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Language Filter */}
        {uniqueLanguages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLanguage('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedLanguage === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
            >
              All
            </button>
            {uniqueLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedLanguage === lang
                  ? 'bg-blue-600 text-white border-blue-500'
                  : `${getLanguageColor(lang)} border`
                  }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {filteredHistories.length !== codeHistories.length && (
        <div className="text-sm text-gray-400">
          Showing {filteredHistories.length} of {codeHistories.length} items
        </div>
      )}

      {/* History List */}
      {filteredHistories.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No results found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          {filteredHistories.map((history) => (
            <div
              key={history._id || history.id}
              className="group p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-500/50 rounded-lg transition-all cursor-pointer transform hover:scale-[1.01]"
              onClick={() => handleLoadCode(history)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Language Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border ${getLanguageColor(
                      history.language
                    )}`}
                  >
                    {getLanguageIcon(history.language)}
                  </div>

                  {/* Title and Metadata */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-blue-400 transition-colors">
                      {history.title || 'Untitled Code'}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatRelativeTime(history.updatedAt || history.createdAt)}</span>
                      </span>
                      {history.preference && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{history.preference}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons and Error Count Badge */}
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => handleEdit(e, history)}
                    className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Edit/Load this code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDelete(e, history._id || history.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Delete this history"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* Error Count Badge */}
                  {history.errors && history.errors.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {history.errors.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Code Preview */}
              <div className="mt-3 p-3 bg-gray-900/50 rounded border border-gray-700/50">
                <p className="text-xs text-gray-400 font-mono line-clamp-2 leading-relaxed">
                  {history.originalCode?.substring(0, 150) || 'No code preview available'}
                  {history.originalCode && history.originalCode.length > 150 && '...'}
                </p>
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {history.improvedCode && (
                    <span className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Improved</span>
                    </span>
                  )}
                  {history.explanation && (
                    <span className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Explained</span>
                    </span>
                  )}
                </div>
                <svg
                  className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeHistoryTabs;

