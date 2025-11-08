import React, { useState } from 'react';
import { PanelType } from '../types';
import { ChatPanel } from './ChatPanel';
import { SummarizePanel } from './SummarizePanel';
import { QuizPanel } from './QuizPanel';

const panelComponents: { [key in PanelType]: React.ComponentType } = {
  [PanelType.CHAT]: ChatPanel,
  [PanelType.SUMMARIZE]: SummarizePanel,
  [PanelType.QUIZ]: QuizPanel,
};

export const Dashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>(PanelType.CHAT);

  const ActiveComponent = panelComponents[activePanel];

  return (
    <div className="container mx-auto p-4 md:p-6 flex-1 flex flex-col">
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-700 mb-6">
        <nav className="flex space-x-2 sm:space-x-4" aria-label="Tabs">
          {Object.values(PanelType).map((panel) => (
            <button
              key={panel}
              onClick={() => setActivePanel(panel)}
              className={`
                px-3 py-2 font-medium text-sm sm:text-base rounded-t-lg transition-colors
                ${
                  activePanel === panel
                    ? 'border-b-2 border-primary text-primary dark:text-primary-light'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }
              `}
            >
              {panel}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <ActiveComponent />
      </div>
    </div>
  );
};
