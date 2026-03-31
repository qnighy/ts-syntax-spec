# ts-syntax-spec

Unofficial specification for TypeScript syntax, written as an extension to ECMA-262 using Ecmarkup.

## Build

- `npm run build` -- build with lint (use this to check your work)
- `npm run format` -- auto-format spec.emu with emu-format
- Utility scripts go in `scripts/` as `.mts` files, run with `node --experimental-strip-types`

## Spec structure

- `spec.emu` -- the single source file, written in Ecmarkup/Grammarkdown HTML
  - "TypeScript Language: Types" section defines the normative type grammar
  - "TypeScript Language: Expressions" and "Functions and Classes" extend ECMA-262 productions
  - Annex "TypeScript Permissive Grammars" describes TSC's error-recovering parser behavior using `Perm*`-prefixed nonterminals; the inline notes in the main spec use `Permissive*` prefix instead
  - Permissive grammar uses `Type` (not `PermType`) inside delimiters like `()`, `[]`, `{}`

## Reference implementations

- `references/TypeScript/` -- TSC source (see `references/TypeScript.md` for reading guide)
  - Key file: `src/compiler/parser.ts` (permissive recursive-descent parser)
  - Key file: `src/compiler/checker.ts` (includes post-parse syntactic validation)
- `references/babel/` -- Babel parser (see `references/babel.md`)
- `references/ecma262/` -- upstream ECMA-262 spec

## Conventions

- Grammar parameters `[Yield, Await]` must be threaded through all production references consistently
- Represent indefinite lookaheads using `[lookahead ...]` syntax with nonterminals. It is forbidden in ECMAScript, but we need it because TypeScript syntax works differently; it is highly influenced by TSC's design philosophy (or lack thereof regarding syntactic sanity) and we want to be able to express it precisely.
- For Annex A permissive grammar, the following conditions must be met:
  - All productions must have a unique match to the prefix of any input stream satisfying a certain lookahead condition (e.g. `PermTypeImportCall` assumes ``[lookahead = `import`]``).
  - The `PermType` production must have a unique match to the prefix of any input stream (i.e. `PermType` has the vacant lookahead condition).

## Known Grammarkdown lint warnings

Grammarkdown does not support `[no LineTerminator here]` at the start of a lookahead set element. Work around this by prepending a backquoted space (`` ` ` ``) before `[no LineTerminator here]`, following the existing pattern in `PermTypeReference`.
