import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function listModels() {
  try {
    const output = await ai.models.list();
    console.log(JSON.stringify(output, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
