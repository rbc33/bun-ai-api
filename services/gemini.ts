import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { AIService, ChatMessage } from "../types/types";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const geminiService: AIService = {
  name: "gemini",
  async chat(messages: ChatMessage[]) {
    // Extract system message first
    const systemMessage = messages.find((m) => m.role === "system");

    const tools = [
      {
        googleSearch: {},
      },
    ];
    const config = {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
      tools,
      systemInstruction: systemMessage
        ? { parts: [{ text: systemMessage.content }] }
        : undefined,
    };
    const model = "gemini-2.0-flash-exp";

    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    return (async function* () {
      for await (const chunk of response) {
        yield chunk.text || "";
      }
    })();
  },
};
