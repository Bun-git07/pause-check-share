import { GoogleGenerativeAI } from '@google/generative-ai';
import { CORE_INTELLIGENCE_PROMPT } from './mockAI';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

// Initialize Gemini SDK with the API key from environment variables
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Returns a configured Gemini model instance with the provided system prompt.
 * Always defaults to using gemini-3.1-pro to ensure high intelligence for fact-checking.
 * If no API key is provided, returns null.
 */
export function getChasCheckerModel(systemInstruction: string = CORE_INTELLIGENCE_PROMPT) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: 'gemini-3.1-pro',
    systemInstruction,
  });
}
