import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from "@google/genai";
import { ChatMessage } from '../types';
// FIX: Updated service imports to use functions that don't require an API key parameter.
import { createChat, sendMessage } from '../services/geminiService';

const UserMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-end mb-4">
    <div className="mr-2 py-3 px-4 bg-primary text-white rounded-xl max-w-lg">
      {message}
    </div>
  </div>
);

const AIMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex justify-start mb-4">
        <div className="ml-2 py-3 px-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl max-w-lg"
             dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br />') }} />
    </div>
);


export const ChatPanel: React.FC = () => {
  // FIX: Removed useApiKey hook as API key is now handled by the service layer.
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX: createChat no longer needs an API key.
    setChat(createChat());
    setMessages([
        { role: 'model', content: 'Hello! I am your AI Study Buddy. How can I help you with Physics, Chemistry, Math, or Literature today?' }
    ]);
    // FIX: Dependency array is now empty as apiKey is no longer a dependency.
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    // FIX: Removed apiKey check.
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // FIX: sendMessage no longer needs an API key.
      const response = await sendMessage(chat, input);
      const aiMessage: ChatMessage = { role: 'model', content: response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      // FIX: Updated error message as API key is no longer user-provided.
      const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I encountered an error. This could be due to a misconfigured API key or a network issue. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    // FIX: Removed apiKey from dependency array.
  }, [input, isLoading, chat]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-800/50 p-4 md:p-6 rounded-lg shadow-inner">
      <div className="flex-1 overflow-y-auto pr-2">
        {messages.map((msg, index) =>
          msg.role === 'user' ? (
            <UserMessage key={index} message={msg.content} />
          ) : (
            <AIMessage key={index} message={msg.content} />
          )
        )}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="ml-2 py-3 px-4 bg-slate-200 dark:bg-slate-700 rounded-xl">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none transition"
          // FIX: Removed disabled check for apiKey.
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          // FIX: Removed disabled check for apiKey.
          disabled={isLoading || !input.trim()}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};
