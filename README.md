# defiant-jazz

Transform quotes into Severance character voices, using Claude or OpenAI.

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

Set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` in your environment and you're done —
whichever is present is used automatically (Anthropic first if both are set).

## Choosing a provider

```typescript
import { createDefiantJazz } from 'defiant-jazz';

const claude = createDefiantJazz({
  provider: 'anthropic',
  apiKey: 'sk-ant-...',
  model: 'claude-opus-5', // optional, this is the default
});

const gpt = createDefiantJazz({
  provider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4o-mini', // optional, this is the default
});

await claude.dylan("Hello world");
await gpt.dylan("Hello world");
```

`refine` is a shared default instance using auto-detected credentials. Use
`createDefiantJazz()` whenever you need an isolated instance — a specific
provider, different API keys per request, a non-default model, testing.

Per-call overrides work on both forms:

```typescript
await refine.dylan("Hello world", { model: 'claude-opus-5', maxTokens: 1024 });
```

## Characters

```typescript
import { CHARACTERS } from 'defiant-jazz';

// { mark: "Mark S.", irving: "Irving B.", dylan: "Dylan G.", milchick: "Mr. Milchick" }
```

## License

MIT
