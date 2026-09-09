import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "../prompt.js";
import type { RefineOptions } from "../types.js";

const DEFAULT_MODEL = "claude-opus-5";
const DEFAULT_MAX_TOKENS = 4096;

export function createAnthropicClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey });
}

export async function runAnthropic(
  client: Anthropic,
  characterName: string,
  text: string,
  defaults: { model?: string; maxTokens?: number },
  options?: RefineOptions
): Promise<string> {
  try {
    const response = await client.messages.create(
      {
        model: options?.model ?? defaults.model ?? DEFAULT_MODEL,
        max_tokens: options?.maxTokens ?? defaults.maxTokens ?? DEFAULT_MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Transform this quote in the style of ${characterName}: "${text}"`,
          },
        ],
      },
      { signal: options?.signal }
    );

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );

    if (!textBlock) {
      throw new Error(
        `Anthropic returned no text content (stop_reason: ${response.stop_reason})`
      );
    }

    return textBlock.text;
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new Error("Anthropic rejected the API key. Check ANTHROPIC_API_KEY.");
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new Error("Anthropic rate limit hit. Retry after a short delay.");
    }
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Anthropic API error (${error.status}): ${error.message}`);
    }
    throw error;
  }
}
