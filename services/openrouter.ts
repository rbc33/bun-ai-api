import { OpenRouter } from "@openrouter/sdk";
import type { AIService, ChatMessage } from "../types/types";

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const openRouterService: AIService = {
  name: "openrouter",
  async chat(messages: ChatMessage[]) {
    const stream = await openRouter.chat.send({
      model: "xiaomi/mimo-v2-flash:free",
      messages: messages as any,
      stream: true,
    });
    return (async function* () {
      for await (const chunk of stream) {
        yield (chunk as any).choices[0]?.delta?.content || "";
      }
    })();
  },
};
