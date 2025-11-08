import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { QuizQuestion } from '../types';

// FIX: Initialize GoogleGenAI once using the API key from environment variables.
// This aligns with the coding guidelines, which mandate using `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });


// FIX: Removed apiKey parameter. The singleton 'ai' instance is used directly.
export const createChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and friendly academic tutor for students. Explain concepts clearly and concisely. Format your answers using markdown.',
    },
  });
};

// FIX: Removed apiKey parameter.
export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  const response: GenerateContentResponse = await chat.sendMessage({ message });
  return response.text;
};

// FIX: Removed apiKey parameter.
export const summarizeText = async (text: string, difficulty: string): Promise<string> => {
  const prompt = `Summarize the following text at a ${difficulty} level. Focus on the key concepts and present them clearly.

Text to summarize:
---
${text}
---
`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text;
};

// FIX: Removed apiKey parameter.
export const generateQuiz = async (context: string, numQuestions: number): Promise<QuizQuestion[]> => {
  const quizSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: 'The quiz question.',
        },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: 'An array of 4 possible answers.',
        },
        correctAnswerIndex: {
          type: Type.INTEGER,
          description: 'The 0-based index of the correct answer in the options array.',
        },
      },
      required: ['question', 'options', 'correctAnswerIndex'],
    },
  };

  const prompt = `Based on the following text, generate a multiple-choice quiz with ${numQuestions} questions. Each question should have 4 options.

Text:
---
${context}
---
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: quizSchema,
    },
  });

  try {
    const jsonStr = response.text.trim();
    const quizData = JSON.parse(jsonStr);
    
    // Basic validation to ensure it's an array of questions
    if (Array.isArray(quizData) && quizData.every(q => 'question' in q && 'options' in q && 'correctAnswerIndex' in q)) {
      return quizData as QuizQuestion[];
    } else {
      throw new Error("Generated quiz data does not match the expected format.");
    }
  } catch (error) {
    console.error("Error parsing quiz JSON:", error);
    throw new Error("Failed to generate a valid quiz. The AI's response was not in the correct format.");
  }
};
