# defiant-jazz

Transform quotes into Severance character voices, powered by Claude.

```bash
npm install defiant-jazz
```

## Usage

```typescript
import { refine } from 'defiant-jazz';

const result = await refine.dylan("I need to focus on my work");
console.log(result.text);
// => "Oh great, more 'work.' Can't wait to stare at numbers until my brain leaks out my ears."
console.log(result.character);
// => "Dylan G."

await refine.mark("...");     // Mark S. - thoughtful, restrained
await refine.irving("...");   // Irving B. - formal, poetic
await refine.dylan("...");    // Dylan G. - sarcastic, irreverent
await refine.milchick("..."); // Mr. Milchick - cheerful, corporate

// Generic form, useful for dynamic character selection
await refine("Hello world", "dylan");
```

Set `ANTHROPIC_API_KEY` in your environment and you're done.

## Multiple instances

`refine` is a shared default. If you need an isolated instance — different
API keys per request, a non-default model, testing — use the factory:

```typescript
import { createDefiantJazz } from 'defiant-jazz';

const dj = createDefiantJazz({
  apiKey: 'sk-ant-...',
  model: 'claude-opus-5', // optional, this is the default
});

await dj.dylan("Hello world");
```

Per-call overrides work on both forms:

```typescript
await refine.dylan("Hello world", { model: 'claude-opus-5', maxTokens: 1024 });
```

## Characters

```typescript
import { CHARACTERS } from 'defiant-jazz';

// { mark: "Mark S.", irving: "Irving B.", dylan: "Dylan G.", milchick: "Mr. Milchick" }
```

## Migrating from OpenAI

Versions before 1.0 also supported OpenAI. If you're upgrading:

- Swap `OPENAI_API_KEY` for `ANTHROPIC_API_KEY`.
- Drop any `model` override tied to an OpenAI model name (e.g. `gpt-4o-mini`) —
  pass an Anthropic model instead, or omit it to use the default.

## License

MIT
