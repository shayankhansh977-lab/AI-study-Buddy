import React, { useState, useCallback } from 'react';
import { summarizeText } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

export const SummarizePanel: React.FC = () => {
  const [text, setText] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = useCallback(async () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const result = await summarizeText(text, difficulty);
      setSummary(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [text, difficulty, isLoading]);

  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6">
      <div className="flex-1 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 flex flex-col">
          <label htmlFor="note-input" className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
            Paste your notes here
          </label>
          <textarea
            id="note-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to summarize..."
            className="flex-1 p-4 w-full rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none transition resize-none"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <label htmlFor="summary-output" className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
            Summary
          </label>
          <div className="flex-1 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <SparklesIcon className="w-8 h-8 text-primary animate-pulse" />
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : summary ? (
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{summary}</p>
            ) : (
              <p className="text-slate-400 dark:text-slate-500">Your generated summary will appear here.</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
            <label htmlFor="difficulty" className="font-medium text-slate-700 dark:text-slate-300">Difficulty:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option>Basic</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
        </div>
        <button
          onClick={handleSummarize}
          disabled={isLoading || !text.trim()}
          className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <SparklesIcon className="w-5 h-5"/>
          Summarize
        </button>
      </div>
    </div>
  );
};
