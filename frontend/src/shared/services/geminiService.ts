import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiModel = "gemini-3.1-flash-lite-preview";

export async function generateCampusInsight(prompt: string) {
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: prompt,
  });
  return response.text;
}
