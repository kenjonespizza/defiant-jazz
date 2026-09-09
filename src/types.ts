export type CharacterKey = "mark" | "irving" | "dylan" | "milchick";

export type Provider = "anthropic" | "openai";

export interface RefineResult {
  text: string;
  character: string;
}

export interface DefiantJazzOptions {
  /** Explicit provider. Defaults to whichever API key is set (Anthropic first). */
  provider?: Provider;
  apiKey?: string;
  model?: string;
  maxTokens?: number;
}

export interface RefineOptions {
  model?: string;
  maxTokens?: number;
  signal?: AbortSignal;
}
