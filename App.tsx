import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen font-sans text-slate-900 dark:text-slate-50 bg-white dark:bg-slate-900">
        <Header />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
