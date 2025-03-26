import { perplexity } from "@ai-sdk/perplexity";
import { streamText } from "ai";
import { CHAT_SYSTEM_PROMPT } from "./prompts";

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Create the streaming response
    const result = streamText({
        model: perplexity("sonar-pro"), // Using sonar-pro model
        messages,
        system: CHAT_SYSTEM_PROMPT,
    });

    // Convert the result to a streaming response
    return result.toDataStreamResponse({
        getErrorMessage: (error) => {
            if (error instanceof Error) return error.message;
            return "An error occurred while processing your request.";
        },
        // Send usage and sources information to the client
        sendUsage: true,
        sendSources: true,
    });
}
