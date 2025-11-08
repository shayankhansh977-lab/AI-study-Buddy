import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

// FIX: Removed ApiKeyModal and related logic to adhere to the guideline
// of using API keys from environment variables. This also resolves the
// original import error as ApiKeyProvider and useApiKey are no longer needed here.
const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col h-screen font-sans text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-900">
      <Header />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
        <AppContent />
    </ThemeProvider>
  );
}

export default App;
