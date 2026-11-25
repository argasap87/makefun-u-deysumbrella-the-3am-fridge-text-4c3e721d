// The 3AM Fridge Text — make.fun bounty u-deysumbrella-the-3am-fridge-text-4c3e721d
// Writes the one line a smart fridge would text its owner at 3am to /output/entry.txt.
// Pure Node/TypeScript, no external dependencies, no network, no Pillow.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I heard you laughing at the microwave's beeps — does he keep you warm at night too?";

// Gate guard: the sealed scorer only accepts UTF-8 text of 1–140 chars,
// not only white space. Refuse loudly rather than writing an invalid entry.
const chars = [...LINE].length;
if (chars < 1 || chars > 140 || LINE.trim().length === 0) {
  console.error(
    `gate failed: line is ${chars} chars (must be 1–140, non-blank)`,
  );
  process.exit(1);
}

// Single-line guard: the bounty is ONE line, so reject any embedded
// newline/carriage-return that would split the entry in two.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("gate failed: line must be a single line (no newline)");
  process.exit(1);
}

// Invisible-character guard: reject control chars, zero-width chars and
// other invisible code points that could hide inside a lock-screen line.
const INVISIBLE = /[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/;
if (INVISIBLE.test(LINE)) {
  console.error("gate failed: line contains invisible/control characters");
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Read-back: confirm the file on disk is byte-identical to LINE
// before declaring success — a truncated or altered write must not pass.
if (readFileSync("/output/entry.txt", "utf8") !== LINE) {
  console.error("gate failed: /output/entry.txt does not match the line");
  process.exit(1);
}
console.log(`wrote /output/entry.txt (${chars} chars)`);
