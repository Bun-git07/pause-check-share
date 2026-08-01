'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateGeminiAnalysis(
  systemInstruction: string,
  prompt: string,
  fileData?: string,
  fileMimeType?: string
): Promise<string | null> {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    });

    if (fileData && fileMimeType) {
      const base64String = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      const parts = [
        prompt,
        {
          inlineData: {
            data: base64String,
            mimeType: fileMimeType
          }
        }
      ];
      const response = await model.generateContent(parts);
      return response.response.text();
    } else {
      const response = await model.generateContent(prompt);
      return response.response.text();
    }
  } catch (err) {
    console.error('Server-side Gemini generation error:', err);
    return null;
  }
}
