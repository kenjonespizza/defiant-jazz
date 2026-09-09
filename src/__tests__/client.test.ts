import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const anthropicCreate = vi.fn();
const openaiCreate = vi.fn();

vi.mock("@anthropic-ai/sdk", () => {
  class MockAnthropic {
    apiKey: string;
    messages = { create: anthropicCreate };
    constructor(opts: { apiKey: string }) {
      this.apiKey = opts.apiKey;
    }
  }
  class AuthenticationError extends Error {}
  class RateLimitError extends Error {}
  class APIError extends Error {
    status = 500;
  }
  return {
    default: Object.assign(MockAnthropic, {
      AuthenticationError,
      RateLimitError,
      APIError,
    }),
  };
});

vi.mock("openai", () => {
  class MockOpenAI {
    apiKey: string;
    chat = { completions: { create: openaiCreate } };
    constructor(opts: { apiKey: string }) {
      this.apiKey = opts.apiKey;
    }
  }
  return { default: MockOpenAI };
});

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  anthropicCreate.mockReset();
  openaiCreate.mockReset();
  process.env = { ...ORIGINAL_ENV };
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.OPENAI_API_KEY;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

describe("CHARACTERS", () => {
  it("maps every character key to a display name", async () => {
    const { CHARACTERS } = await import("../index.js");
    expect(CHARACTERS).toEqual({
      mark: "Mark S.",
      irving: "Irving B.",
      dylan: "Dylan G.",
      milchick: "Mr. Milchick",
    });
  });
});

describe("input validation", () => {
  it("throws on empty text", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    const { createDefiantJazz } = await import("../index.js");
    const dj = createDefiantJazz();
    await expect(dj.dylan("")).rejects.toThrow(/cannot be empty/);
  });

  it("throws on whitespace-only text", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    const { createDefiantJazz } = await import("../index.js");
    const dj = createDefiantJazz();
    await expect(dj.dylan("   ")).rejects.toThrow(/cannot be empty/);
  });
});

describe("provider resolution", () => {
  it("throws a useful error when no API key is set", async () => {
    const { createDefiantJazz } = await import("../index.js");
    const dj = createDefiantJazz();
    await expect(dj.dylan("hello")).rejects.toThrow(/ANTHROPIC_API_KEY/);
  });

  it("uses Anthropic when ANTHROPIC_API_KEY is set", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    anthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: "mocked" }],
    });

    const { createDefiantJazz } = await import("../index.js");
    const dj = createDefiantJazz();
    const result = await dj.dylan("hello");

    expect(result).toEqual({ text: "mocked", character: "Dylan G." });
    expect(anthropicCreate).toHaveBeenCalledTimes(1);
    expect(openaiCreate).not.toHaveBeenCalled();
  });

  it("falls back to OpenAI (with a deprecation warning) when only OPENAI_API_KEY is set", async () => {
    process.env.OPENAI_API_KEY = "sk-test";
    openaiCreate.mockResolvedValue({
      choices: [{ message: { content: "mocked openai" } }],
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { createDefiantJazz } = await import("../index.js");
    const dj = createDefiantJazz();
    const result = await dj.dylan("hello");

    expect(result).toEqual({ text: "mocked openai", character: "Dylan G." });
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("deprecated"));
    warnSpy.mockRestore();
  });

  it("prefers an explicit apiKey option over env vars", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-env";
    anthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: "mocked" }],
    });

    const { createDefiantJazz } = await import("../index.js");
    const dj = createDefiantJazz({ apiKey: "sk-ant-explicit" });
    await dj.dylan("hello");

    // The mock client stashes the constructor arg as `.apiKey`.
    expect(anthropicCreate).toHaveBeenCalledTimes(1);
  });
});

describe("generic vs. character-method calls", () => {
  it("refine(text, character) and refine.dylan(text) send identical requests", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    anthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: "mocked" }],
    });

    const { createDefiantJazz } = await import("../index.js");
    const dj = createDefiantJazz();

    await dj("hello", "dylan");
    const genericCall = anthropicCreate.mock.calls[0];

    await dj.dylan("hello");
    const methodCall = anthropicCreate.mock.calls[1];

    expect(genericCall).toEqual(methodCall);
  });
});

describe("empty responses", () => {
  it("throws instead of returning an empty string when Anthropic returns no text block", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    anthropicCreate.mockResolvedValue({ content: [], stop_reason: "end_turn" });

    const { createDefiantJazz } = await import("../index.js");
    const dj = createDefiantJazz();

    await expect(dj.dylan("hello")).rejects.toThrow(/no text content/);
  });
});

describe("configure() / default instance", () => {
  it("updates the shared default instance and clears its cached client", async () => {
    anthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: "mocked" }],
    });

    const { configure, refine } = await import("../index.js");
    configure({ apiKey: "sk-ant-configured" });

    const result = await refine.dylan("hello");
    expect(result.text).toBe("mocked");
  });
});
