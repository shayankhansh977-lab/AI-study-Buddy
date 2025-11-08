import React, { useState } from 'react';
import { useApiKey } from '../hooks/useApiKey';
import { verifyApiKey } from '../services/geminiService';
import { KeyIcon } from './icons/KeyIcon';
import { SparklesIcon } from './icons/SparklesIcon';

export const ApiKeyModal: React.FC = () => {
  const { setApiKey } = useApiKey();
  const [localApiKey, setLocalApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyAndSave = async () => {
    if (!localApiKey.trim()) {
      setError('API Key cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const isValid = await verifyApiKey(localApiKey);
      if (isValid) {
        setApiKey(localApiKey);
      } else {
        setError('Invalid API Key. Please check the key and try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 dark:bg-slate-900 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8">
        <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-primary-light dark:bg-primary/20 rounded-full mb-4">
                 <SparklesIcon className="w-8 h-8 text-primary" />
            </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome to AI Study Buddy</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Please enter your Google Gemini API key to begin.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="api-key" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Gemini API Key
            </label>
            <div className="relative mt-1">
              <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="api-key"
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyAndSave()}
                placeholder="Enter your API key here..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none transition"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleVerifyAndSave}
            disabled={isLoading || !localApiKey.trim()}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              'Verify & Continue'
            )}
          </button>
        </div>
         <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
            You can get your API key from Google AI Studio. Your key is stored locally and never sent to our servers.
          </p>
      </div>
    </div>
  );
};
