import { refine } from "../dist/index.js";

const quotes = [
  // Reused from 0.6.0 verification — comparable to documented history
  "I went hiking this weekend",
  "They gave us pizza instead of raises",
  "If you keep complaining you'll get in trouble",
  // New — not previously run against this prompt
  "I finally finished the project I've been putting off",
  "My coworker keeps taking credit for my ideas",
  "I don't really know why I keep doing this job",
];

const characters = ["mark", "irving", "dylan", "milchick"];

const label = process.argv[2];
if (!label) {
  console.error("Usage: node run.mjs <before|after>");
  process.exit(1);
}

let out = `# Transcript: ${label}\n\nGenerated ${new Date().toISOString()}\n\n`;

for (const quote of quotes) {
  out += `## "${quote}"\n\n`;
  for (const char of characters) {
    process.stderr.write(`  ${label}: ${char} — "${quote}"\n`);
    const result = await refine[char](quote);
    out += `### ${result.character}\n\n${result.text}\n\n`;
  }
}

const fs = await import("node:fs");
fs.writeFileSync(new URL(`./${label}.md`, import.meta.url), out);
console.log(`Wrote transcripts/${label}.md`);
