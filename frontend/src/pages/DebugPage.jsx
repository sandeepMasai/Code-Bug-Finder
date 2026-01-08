import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import ResultPanel from '../components/ResultPanel';
import PreferenceSelector from '../components/PreferenceSelector';
import CodeTabs from '../components/CodeTabs';
import CodeHistoryTabs from '../components/dashboard/CodeHistoryTabs';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const DebugPage = () => {
  const { user, token } = useAuth();
  
  // Code state
  const [code, setCode] = useState('');
  const [improvedCode, setImprovedCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [preference, setPreference] = useState('Simple');
  const [activeTab, setActiveTab] = useState('original');
  const [errors, setErrors] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load code state from localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('code');
    const savedLanguage = localStorage.getItem('language');
    const savedPreference = localStorage.getItem('preference');

    if (savedCode) setCode(savedCode);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedPreference) setPreference(savedPreference);
  }, []);

  // Persist code state to localStorage
  useEffect(() => {
    if (code) localStorage.setItem('code', code);
    localStorage.setItem('language', language);
    localStorage.setItem('preference', preference);
  }, [code, language, preference]);

  const findBugs = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setErrors([]);
    setExplanation('');
    setImprovedCode('');

    try {
      const response = await axios.post(API_ENDPOINTS.BUGS.FIND, {
        code,
        language,
        preference,
      });

      if (response.data.success) {
        const analysisErrors = response.data.errors || [];
        const analysisImprovedCode = response.data.improvedCode || '';
        const analysisExplanation = response.data.explanation || '';

        setErrors(analysisErrors);
        setImprovedCode(analysisImprovedCode);
        setExplanation(analysisExplanation);

        if (analysisImprovedCode) {
          setActiveTab('improved');
        }

        // Auto-save after successful analysis (if user is logged in)
        if (user && token && code.trim()) {
          setTimeout(async () => {
            try {
              setSaving(true);
              await axios.post(
                API_ENDPOINTS.HISTORY.SAVE,
                {
                  title: `Code - ${new Date().toLocaleString()}`,
                  originalCode: code,
                  improvedCode: analysisImprovedCode,
                  language: language || 'JavaScript',
                  preference: preference || 'Simple',
                  errors: analysisErrors,
                  explanation: analysisExplanation,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              console.log('Code auto-saved successfully');
            } catch (err) {
              console.log('Auto-save failed:', err.response?.data?.error || err.message);
            } finally {
              setSaving(false);
            }
          }, 1000);
        }
      } else {
        setError('Failed to analyze code. Please try again.');
      }
    } catch (err) {
      console.error('Error finding bugs:', err);
      if (err.response) {
        setError(err.response.data?.message || err.response.data?.error || 'An error occurred');
      } else if (err.request) {
        setError('Unable to connect to the server. Make sure the backend is running.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [code, language, preference, user, token]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePreferenceChange = (newPreference) => {
    setPreference(newPreference);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Save code history (manual save)
  const handleSaveCode = async () => {
    if (!token || !code.trim()) {
      setError('Please login and enter code to save.');
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post(
        API_ENDPOINTS.HISTORY.SAVE,
        {
          title: `Code - ${new Date().toLocaleString()}`,
          originalCode: code,
          improvedCode: improvedCode || '',
          language: language || 'JavaScript',
          preference: preference || 'Simple',
          errors: errors || [],
          explanation: explanation || '',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert('Code saved successfully!');
      }
    } catch (err) {
      console.error('Save error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save code history';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Load code from history
  const handleLoadCode = (historyData) => {
    setCode(historyData.originalCode || historyData.code);
    setImprovedCode(historyData.improvedCode || '');
    setLanguage(historyData.language);
    setPreference(historyData.preference);
    setErrors(historyData.errors || []);
    setExplanation(historyData.explanation || '');
    setActiveTab(historyData.improvedCode ? 'improved' : 'original');
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Code Debugger AI</h1>
            <p className="text-gray-400">
              Analyze your code for bugs, spelling mistakes, and get AI-powered improvements
            </p>
          </div>

          {showHistory && user && (
            <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  My Code History
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <CodeHistoryTabs onLoadCode={handleLoadCode} token={token} />
            </div>
          )}

          {user && !showHistory && (
            <div className="mb-4">
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>View My History</span>
              </button>
            </div>
          )}

          <div className="mb-4 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language:</label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
              </select>
            </div>
            <PreferenceSelector preference={preference} onPreferenceChange={handlePreferenceChange} disabled={loading} />
            <button
              onClick={findBugs}
              disabled={loading || !code.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Analyzing...' : 'Find Bugs'}
            </button>
            {user && (
              <button
                onClick={handleSaveCode}
                disabled={saving || !code.trim()}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Code'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <CodeTabs activeTab={activeTab} onTabChange={handleTabChange} />
              <CodeEditor
                code={code}
                improvedCode={improvedCode}
                language={language}
                activeTab={activeTab}
                errors={errors}
                onCodeChange={handleCodeChange}
                onTabChange={handleTabChange}
                height="600px"
              />
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <ResultPanel errors={errors} explanation={explanation} improvedCode={improvedCode} loading={loading} error={error} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;

