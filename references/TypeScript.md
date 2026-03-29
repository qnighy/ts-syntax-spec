# How to read TypeScript (< 7.0) parser

The submodule is located at references/TypeScript.

## Important files

```
src/
  compiler/
    parser.ts  # the "parser" in a narrow sense.
    program.ts # includes validation against TypeScript-specific syntax in JavaScript code.
    checker.ts # the type checker, including syntactic validation rules.
```

## Important entrypoints

- Primary types are parsed by `parseNonArrayType` in `parser.ts`.
- Types at top level are parsed by `parseType` in `parser.ts`.
  However, for return types, the entry point is `parseTypeOrTypePredicate` in `parser.ts`.
- Type argument lists have two different entry points:
  - `parseTypeArgumentsOfTypeReference` for type arguments in type context.
  - `parseTypeArgumentsInExpression` for type arguments in expression context.
- Primary expressions are parsed by `parsePrimaryExpression` in `parser.ts`.
- Expressions at top level are parsed by `parseExpression` in `parser.ts`.
- Statements and declarations are parsed by `parseStatement` in `parser.ts`.

## Notes

- The parser as implemented in `parser.ts` is a permissive parser, in that it always reads through the entire input, even if it encounters syntax errors. Nonterminals are implemented as a recursive descent parsing function that increment a pointer into the input, accumulate errors if any, and return a node.
- The errors reported in `parser.ts` are not sufficient to narrow down the set of syntactically valid TypeScript sources as understood by ecosystem around TypeScript. `checker.ts` includes additional syntactic validation rules.
- There is no clear way to distinguish between syntactic errors and type-level errors emitted in `checker.ts`. As a hint, most errors emitted via `grammarError*` functions are indeed syntactic, but there are exceptions too.
