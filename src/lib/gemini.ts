import { GoogleGenerativeAI } from '@google/generative-ai';
import { CHASCHECKER_SYSTEM_PROMPT_V2 } from './mockAI';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export function getChasCheckerModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: CHASCHECKER_SYSTEM_PROMPT_V2,
  });
}
