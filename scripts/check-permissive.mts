// Script to find all Perm* nonterminals that are referenced but not defined
// in the permissive grammar annex of spec.emu

import { readFileSync } from "fs";

const content = readFileSync("spec.emu", "utf-8");

// Extract the permissive annex section
const annexStart = content.indexOf('<emu-annex id="sec-ts-permissive-grammars">');
const annexEnd = content.indexOf("</emu-annex>", annexStart);
const annex = content.slice(annexStart, annexEnd);

// Find all grammar blocks in the annex
const grammarBlocks = [...annex.matchAll(/<emu-grammar[^>]*>([\s\S]*?)<\/emu-grammar>/g)].map(
  (m) => m[1]
);

const allGrammarText = grammarBlocks.join("\n");

// Find defined nonterminals (appear at the start of a line followed by colon or ::)
const defined = new Set<string>();
for (const match of allGrammarText.matchAll(/^\s+(\w+)(?:\[[^\]]*\])?\s*(?:::|:(?!:))/gm)) {
  defined.add(match[1]);
}

// Find referenced nonterminals (appear in RHS of productions)
const referenced = new Set<string>();
for (const match of allGrammarText.matchAll(/(?<=[\s\[`(,]|^)(\w+)(?:\[[^\]]*\])?(?=\s|$|[`),\]])/gm)) {
  const name = match[1];
  // Filter to likely nonterminals (start with uppercase or Perm prefix)
  if (/^[A-Z]/.test(name) && name !== "NumericLiteral" && !name.startsWith("LineTerminator")) {
    referenced.add(name);
  }
}

console.log("=== Defined nonterminals in permissive annex ===");
for (const d of [...defined].sort()) {
  console.log(`  ${d}`);
}

console.log("\n=== Referenced but not defined (potentially missing) ===");
for (const r of [...referenced].sort()) {
  if (!defined.has(r)) {
    console.log(`  ${r}`);
  }
}

// Now find all Perm* references across the ENTIRE file
console.log("\n=== All Perm* references in entire file ===");
const allPermRefs = new Set<string>();
for (const match of content.matchAll(/\b(Perm\w+)\b/g)) {
  allPermRefs.add(match[1]);
}
for (const r of [...allPermRefs].sort()) {
  const isDefined = defined.has(r);
  console.log(`  ${r} ${isDefined ? "(defined)" : "(NOT defined)"}`);
}

// Find all type productions in the main spec (non-annex part)
console.log("\n=== Type productions defined in main spec (sec-typescript-language-types) ===");
const typesStart = content.indexOf('<emu-clause id="sec-typescript-language-types">');
const typesEnd = content.indexOf("</emu-clause>\n\n<emu-clause", typesStart);
const typesSection = content.slice(typesStart, typesEnd);

const mainGrammarBlocks = [
  ...typesSection.matchAll(/<emu-grammar type="definition">([\s\S]*?)<\/emu-grammar>/g),
].map((m) => m[1]);

const mainDefined = new Set<string>();
for (const block of mainGrammarBlocks) {
  for (const match of block.matchAll(/^\s+(\w+)(?:\[[^\]]*\])?\s*:(?::|\s)/gm)) {
    mainDefined.add(match[1]);
  }
}
for (const d of [...mainDefined].sort()) {
  const hasPermEquiv = defined.has(`Perm${d}`);
  console.log(`  ${d} ${hasPermEquiv ? `-> Perm${d} (exists)` : "(no Perm* equivalent)"}`);
}
