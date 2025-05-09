
import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyBXT8PN6v7G62bjikvKOBZkMqMddiykpes";
const genAI = new GoogleGenAI({ apiKey: API_KEY });

export type AIPromptType = 'analyze' | 'summarize' | 'improve' | 'brainstorm' | 'research';

interface AIResponse {
  text: string;
  error?: string;
}

const promptTemplates = {
  analyze: (content: string) => `Analyze the following academic text and provide key insights, potential gaps, and suggestions for improvement:\n\n${content}`,
  summarize: (content: string) => `Summarize the following academic text in a concise manner, highlighting the most important points:\n\n${content}`,
  improve: (content: string) => `Review the following academic text and suggest improvements for clarity, structure, and argumentation:\n\n${content}`,
  brainstorm: (content: string) => `Based on the following academic text, suggest related research directions, arguments, or counter-arguments that could be explored:\n\n${content}`,
  research: (content: string) => `Identify key research papers, authors, or theories that relate to the following academic text that might be worth exploring:\n\n${content}`,
};

export async function generateAIContent(
  content: string,
  promptType: AIPromptType
): Promise<AIResponse> {
  try {
    const prompt = promptTemplates[promptType](content);
    
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    const text = response.text;
    
    return { text };
  } catch (error) {
    console.error("Error generating AI content:", error);
    return { 
      text: "",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

export function createInsightFromAI(text: string, type: AIPromptType): {
  id: string,
  title: string,
  text: string,
  source: string,
  relevance: number
} {
  const titles = {
    analyze: "Content Analysis",
    summarize: "Document Summary",
    improve: "Writing Improvements",
    brainstorm: "Related Ideas",
    research: "Research Connections"
  };
  
  return {
    id: `insight-${Date.now()}`,
    title: titles[type],
    text,
    source: "Gemini AI",
    relevance: Math.floor(75 + Math.random() * 25) // Random relevance between 75-100
  };
}
