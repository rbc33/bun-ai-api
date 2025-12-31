import { cerebrasService } from "./services/cerebras";
import { geminiService } from "./services/gemini";
import { groqService } from "./services/groq";
import type { AIService, ChatMessage } from "./types/types";

const services: AIService[] = [groqService, geminiService, cerebrasService];

let currentService = 0;

function getNextService() {
  const service = services[currentService];
  currentService = (currentService + 1) % services.length;
  return service;
}

const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname === "/chat" && req.method === "POST") {
      const { messages } = (await req.json()) as { messages: ChatMessage[] };

      let attempts = 0;
      let lastError: any;

      while (attempts < services.length) {
        const service = getNextService();
        console.log(`Using ${service?.name}`);
        try {
          const stream = await service?.chat(messages);
          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              connection: "keep-alive",
            },
          });
        } catch (error) {
          console.error(`Error with ${service?.name}:`, error);
          lastError = error;
          attempts++;
        }
      }

      return new Response(`All services failed. Last error: ${lastError}`, {
        status: 500,
      });
    }
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);
