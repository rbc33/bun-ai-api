import { geminiService } from "./services/gemini";
import { groqService } from "./services/groq";

async function verify() {
  console.log("--- Testing Gemini Service (Directly) ---");
  try {
    const messages = [{ role: "user" as const, content: "Hello" }];
    const stream = await geminiService.chat(messages);
    process.stdout.write("Gemini Response: ");
    for await (const chunk of stream) {
      process.stdout.write(chunk);
    }
    console.log("\nGemini success!");
  } catch (error) {
    console.error("Gemini failed:", error);
  }
}

verify();
