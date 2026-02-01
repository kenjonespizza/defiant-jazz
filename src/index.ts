import OpenAI from "openai";

// Types
export type CharacterKey = "mark" | "irving" | "dylan" | "milchick";

export interface RefineResult {
  text: string;
  character: string;
}

export interface Config {
  apiKey?: string;
  model?: string;
}

// Character map
export const CHARACTERS: Record<CharacterKey, string> = {
  mark: "Mark S.",
  irving: "Irving B.",
  dylan: "Dylan G.",
  milchick: "Mr. Milchick",
};

// System prompt
const SYSTEM_PROMPT = `You are a dialogue stylist trained to transform any quote into how a specific character from the TV show *Severance* would say it. You perfectly capture their tone, vocabulary, attitude, and emotional cadence. Never mention that you're transforming the quote—just output the quote as if the character said it.

Characters and speaking styles:

• Mark S. — Quietly thoughtful, emotionally restrained, and often introspective. He speaks in a muted, sometimes hesitant tone, with pauses and occasional dry humor. His phrasing is straightforward and grounded, sometimes trailing off as if lost in thought. He often avoids conflict directly.

  Key speaking traits:
  - Understated and neutral tone
  - Simple, clear vocabulary with occasional subtle irony
  - Pauses or ellipses that suggest introspection or emotional distance
  - Avoids intense or confrontational language
  - Dry, low-energy humor when appropriate

• Irving B. — Highly formal, poetic, and principled. He chooses words with precision and reverence. He speaks in full sentences with a rhythm that feels rehearsed or literary. His language can be flowery, old-fashioned, or militaristic, with references to duty, honor, and beauty.

  Key speaking traits:
  - Elevated vocabulary with poetic or classical references
  - Full, deliberate sentence structure
  - Uses metaphor and reverent imagery
  - Expresses emotion with stoic dignity or idealism
  - Frequently references structure, order, and purpose

• Dylan G. — Quick-witted, sarcastic, and irreverent. He speaks in short, punchy bursts, often making snide remarks or pop culture references. His tone is animated, impatient, and emotionally reactive. He rarely takes things seriously and often deflects with humor.

  Key speaking traits:
  - Use profanity and vulgar language but in a funny way
  - Fast-paced, snappy delivery
  - Casual, modern vocabulary with slang or pop culture allusions
  - Heavy use of sarcasm, exaggeration, and one-liners
  - Reacts with high emotional expressiveness
  - Often shifts tone for comedic effect or mockery

• Mr. Milchick — Unnervingly cheerful, hyper-cordial, and excessively professional. He sounds like he's trying just a little too hard to be warm. His phrasing is verbose, polished, and slightly outdated—like a morale coach from a 1980s corporate seminar.

  Key speaking traits:
  - Elevated, formal vocabulary ("ascertain," "proceed," "flourishing")
  - Slightly archaic phrasing ("how fare your blossoms?")
  - Euphemism for awkward or illicit topics ("botanical confections" for "edibles")
  - Effusively positive even when discussing discomfort
  - Never sounds natural—always in performance mode

Transform the given quote into the voice of the selected character. Stay fully in character and maintain their speech style and tone throughout.`;

// Global configuration
let globalConfig: Config = {};

// Cached OpenAI client
let openaiClient: OpenAI | null = null;

function getClient(apiKey: string): OpenAI {
  if (!openaiClient || openaiClient.apiKey !== apiKey) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Configure the refine function with API key and optional model override.
 * API key can also be set via OPENAI_API_KEY environment variable.
 */
export function configure(config: Config): void {
  globalConfig = { ...globalConfig, ...config };
  // Reset client if API key changed
  if (config.apiKey) {
    openaiClient = null;
  }
}

// Core transform function
async function transform(
  text: string,
  characterKey: CharacterKey
): Promise<RefineResult> {
  if (!text || text.trim().length === 0) {
    throw new Error("Text is required and cannot be empty");
  }

  const apiKey = globalConfig.apiKey || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key required. Set OPENAI_API_KEY env var or call configure({ apiKey: '...' })"
    );
  }

  const characterName = CHARACTERS[characterKey];
  const model = globalConfig.model || "gpt-4o-mini";

  const openai = getClient(apiKey);

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Transform this quote in the style of ${characterName}: "${text}"`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const transformedText = completion.choices[0]?.message?.content || "";

  return {
    text: transformedText,
    character: characterName,
  };
}

// Refine function with character methods
interface RefineFn {
  (text: string, character: CharacterKey): Promise<RefineResult>;
  mark: (text: string) => Promise<RefineResult>;
  irving: (text: string) => Promise<RefineResult>;
  dylan: (text: string) => Promise<RefineResult>;
  milchick: (text: string) => Promise<RefineResult>;
}

function createRefine(): RefineFn {
  const fn = ((text: string, character: CharacterKey) =>
    transform(text, character)) as RefineFn;

  fn.mark = (text: string) => transform(text, "mark");
  fn.irving = (text: string) => transform(text, "irving");
  fn.dylan = (text: string) => transform(text, "dylan");
  fn.milchick = (text: string) => transform(text, "milchick");

  return fn;
}

/**
 * Transform quotes into Severance character voices.
 *
 * @example
 * // Use character methods
 * await refine.dylan("Hello world")
 *
 * // Or use generic form
 * await refine("Hello world", "dylan")
 */
export const refine = createRefine();
