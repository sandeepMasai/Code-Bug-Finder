import React from 'react';

const PreferenceSelector = ({ preference, onPreferenceChange, disabled }) => {
  const preferences = [
    { value: 'Simple', label: 'Simple Code', description: 'Beginner-friendly' },
    { value: 'Optimized', label: 'Optimized Code', description: 'Performance focused' },
    { value: 'Best Practices', label: 'Best Practices', description: 'Industry standard' },
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Improvement Style:
      </label>
      <div className="flex gap-2 flex-wrap">
        {preferences.map((pref) => (
          <button
            key={pref.value}
            onClick={() => onPreferenceChange(pref.value)}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              preference === pref.value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={pref.description}
          >
            {pref.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreferenceSelector;

