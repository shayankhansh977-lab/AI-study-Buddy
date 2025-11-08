import React, { useState, useCallback } from 'react';
import { QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

type QuizState = 'config' | 'loading' | 'active' | 'results';

const getMotivationalQuote = (score: number, total: number): { quote: string; author: string } => {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const quotes = {
    high: [
      { quote: "Excellence is not an act, but a habit.", author: "Aristotle" },
      { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    ],
    medium: [
      { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    ],
    low: [
      { quote: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas A. Edison" },
      { quote: "Fall seven times and stand up eight.", author: "Japanese Proverb" },
    ],
  };

  let selectedQuotes;
  if (percentage >= 80) {
    selectedQuotes = quotes.high;
  } else if (percentage >= 50) {
    selectedQuotes = quotes.medium;
  } else {
    selectedQuotes = quotes.low;
  }
  return selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
};


export const QuizPanel: React.FC = () => {
  const [state, setState] = useState<QuizState>('config');
  const [context, setContext] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  const handleGenerateQuiz = useCallback(async () => {
    if (!context.trim()) return;

    setState('loading');
    setError('');
    try {
      const generatedQuestions = await generateQuiz(context, numQuestions);
      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setUserAnswers(new Array(generatedQuestions.length).fill(-1));
        setCurrentQuestionIndex(0);
        setState('active');
      } else {
        setError('The AI could not generate a quiz from the provided text. Please try again with different content.');
        setState('config');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the quiz. Please check your text or try again later.');
      setState('config');
    }
  }, [context, numQuestions]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finish quiz
      let calculatedScore = 0;
      questions.forEach((q, i) => {
        if (q.correctAnswerIndex === userAnswers[i]) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);
      setState('results');
    }
  };

  const handleRestart = () => {
    setState('config');
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setError('');
  };
  
  const renderContent = () => {
    switch(state) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <SparklesIcon className="w-12 h-12 text-primary animate-pulse mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Generating Your Quiz...</h2>
            <p className="text-slate-500 dark:text-slate-400">The AI is hard at work. This might take a moment.</p>
          </div>
        );
      case 'active':
        const question = questions[currentQuestionIndex];
        return (
          <div className="flex flex-col h-full p-4">
            <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</div>
            <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-200">{question.question}</h3>
            <div className="flex-1 space-y-3">
              {question.options.map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${userAnswers[currentQuestionIndex] === index ? 'border-primary bg-primary-light dark:bg-primary/20' : 'border-slate-300 dark:border-slate-600 hover:border-primary/50 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={userAnswers[currentQuestionIndex] === -1}
              className="mt-6 w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        );
      case 'results':
        const quote = getMotivationalQuote(score, questions.length);
        return (
           <div className="h-full overflow-y-auto">
             <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Quiz Complete!</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">Your Score:</p>
                <div className="text-6xl font-bold text-primary mb-6">{score} / {questions.length}</div>
                
                <blockquote className="mb-6 max-w-2xl">
                  <p className="text-lg italic text-slate-500 dark:text-slate-400">"{quote.quote}"</p>
                  <cite className="block text-right not-italic mt-2 text-slate-600 dark:text-slate-300">- {quote.author}</cite>
                </blockquote>

                <button onClick={handleRestart} className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                  Create Another Quiz
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 border-b pb-2 border-slate-200 dark:border-slate-700">Review Your Answers</h3>
                <div className="space-y-6">
                  {questions.map((q, index) => {
                    const userAnswer = userAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswerIndex;
                    return (
                      <div key={index} className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-100">{index + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((option, optionIndex) => {
                            const isThisTheCorrectAnswer = optionIndex === q.correctAnswerIndex;
                            const isThisTheUserAnswer = optionIndex === userAnswer;
                            
                            let optionClass = 'border-slate-300 dark:border-slate-600';
                            if (isThisTheCorrectAnswer) {
                              optionClass = 'border-green-500 bg-green-100/50 dark:bg-green-500/10 text-green-800 dark:text-green-300';
                            } else if (isThisTheUserAnswer && !isCorrect) {
                              optionClass = 'border-red-500 bg-red-100/50 dark:bg-red-500/10 text-red-800 dark:text-red-300';
                            }

                            return (
                              <div key={optionIndex} className={`flex items-center gap-3 p-3 rounded-md border ${optionClass}`}>
                                {isThisTheCorrectAnswer && <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />}
                                {!isThisTheCorrectAnswer && isThisTheUserAnswer && <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />}
                                {!isThisTheCorrectAnswer && !isThisTheUserAnswer && <div className="w-5 h-5 flex-shrink-0" />}
                                <span>{option}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
           </div>
        );
      case 'config':
      default:
        return (
          <div className="p-4 md:p-6 h-full flex flex-col gap-4">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}
            <div className="flex-1 flex flex-col">
              <label htmlFor="quiz-context" className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
                Paste your notes to generate a quiz
              </label>
              <textarea
                id="quiz-context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Enter the text to generate a quiz from..."
                className="flex-1 w-full p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none transition resize-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="num-questions" className="font-medium text-slate-700 dark:text-slate-300">Questions:</label>
                <input
                  type="number"
                  id="num-questions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value)))}
                  min="1"
                  max="10"
                  className="w-20 px-3 py-2 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <button
                onClick={handleGenerateQuiz}
                disabled={!context.trim()}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <SparklesIcon className="w-5 h-5"/>
                Generate Quiz
              </button>
            </div>
          </div>
        );
    }
  }

  return <div className="h-full bg-slate-100 dark:bg-slate-800">{renderContent()}</div>
};