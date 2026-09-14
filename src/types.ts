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
  /**
   * Whether characters reach for Lumon/Severance vocabulary (the break room,
   * waffle parties, Kier, innie/outie, etc.) when a quote's situation calls
   * for it. Defaults to `true`. Set `false` for clean voice-only
   * transformations with no show-specific vocabulary.
   */
  lore?: boolean;
}

export interface RefineOptions {
  model?: string;
  maxTokens?: number;
  signal?: AbortSignal;
  /**
   * Whether this call reaches for Lumon/Severance vocabulary. Overrides the
   * instance-level setting. Defaults to `true`.
   */
  lore?: boolean;
}
