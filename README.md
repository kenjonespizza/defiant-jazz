# defiant-jazz

Transform quotes into Severance character voices using OpenAI.

## Installation

```bash
npm install defiant-jazz
```

## Setup

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY=sk-...
```

Or configure it in code:

```typescript
import { configure } from 'defiant-jazz';

configure({ apiKey: 'sk-...' });
```

> **Security note**: Never hardcode API keys in your source code. Use environment variables or a secrets manager.

## Usage

```typescript
import { refine } from 'defiant-jazz';

// Transform a quote using character methods
const result = await refine.dylan("I need to focus on my work");
console.log(result.text);
// => "Oh great, more 'work.' Can't wait to stare at numbers until my brain leaks out my ears."
console.log(result.character);
// => "Dylan G."

// Available characters
await refine.mark("...");     // Mark S. - thoughtful, restrained
await refine.irving("...");   // Irving B. - formal, poetic
await refine.dylan("...");    // Dylan G. - sarcastic, irreverent
await refine.milchick("..."); // Mr. Milchick - cheerful, corporate

// Generic form (useful for dynamic character selection)
await refine("Hello world", "dylan");
```

## Configuration

```typescript
import { configure } from 'defiant-jazz';

configure({
  apiKey: 'sk-...',      // Required if OPENAI_API_KEY not set
  model: 'gpt-4o'        // Optional, defaults to 'gpt-4o-mini'
});
```

## Response

```typescript
interface RefineResult {
  text: string;        // The transformed quote
  character: string;   // Character name (e.g. "Dylan G.")
}
```

## Characters

Access the character map for building UIs or iterating:

```typescript
import { CHARACTERS } from 'defiant-jazz';

// { mark: "Mark S.", irving: "Irving B.", dylan: "Dylan G.", milchick: "Mr. Milchick" }

Object.entries(CHARACTERS).map(([key, name]) => (
  <option value={key}>{name}</option>
));
```
