# Ambiguity of `<` at the start of an expression (JSX off)

## Symptom

`<` can be one of the following:

- `<T>(x) => x`, an arrow function with type parameters
- `<T>(x)`, a legacy type assertion

## TSC

TSC tries to parse generic arrow functions before trying the other option. See tryParseParenthesizedArrowFunctionExpression.

1. Scan `<`. If not `<`, backtrack and try other options. Note: `<<` is invalid here because we are expecting type parameters rather than type arguments.
2. If the next token is not IdentifierReference or `const`, backtrack and try other options.
3. Permissively scan comma-delimited list of type parameters. It may yield errors, but we will continue parsing anyway. The result is that the position is advanced according to the permissive grammar.
4. Scan `>`, rescanning `>>`, `>>>`, `>>=`, and `>=` as `>` if necessary. If there is no `>`, continue anyway.
5. Scan `(`. If not `(`, backtrack and try other options.
6. Scan comma-delimited list of parameters. If a "start of a parameter name" token (`this`, IdentifierReference, `{`, or `[`) is not found at the beginning of a parameter, backtrack and try other options.
7. Scan `)`. If not `)`, backtrack and try other options.
8. If there is `:`, permissively parse a return type annotation. If the type has a specific type of syntax error or has a specific form, backtrack and try other options.
  - The following is "arrow function blocking parse error" condition:
    - If the type is empty, it blocks arrow functions.
    - It the type is a function type or a constructor type and it lacks a parameter list, it blocks arrow functions.
    - If the type is a function type or a constructor type and its return type recursively satisfies the "arrow function blocking parse error" condition, it blocks arrow functions.
    - If the type is a parenthesized type and its element type recursively satisfies the "arrow function blocking parse error" condition, it blocks arrow functions.
  - If the type is a JSDoc function type (`function()`) arbitrarily nesteed in parentheses and the next token is `{`, backtrack and try other options.
9. Scan `=>`. If the next token is not `=>` or `{`, backtrack and try other options. If the next token is `{`, don't consume it and continue anyway.
10. Final rescan opportunity for `:`: if it is a context where an else branch of a conditional expression is allowed, a return type annotation is found anyway, and the next token is not `:`, backtrack and try other options.
11. Otherwise, it is definitely a generic arrow function.

The algorithm is shared with the `async<` case and the `<` case with JSX on, see [async-lt.md](./ambiguities/async-lt.md) and [lt-with-jsx.md](./ambiguities/lt-with-jsx.md) for details.

## Babel

Babel tries to parse generic arrow functions before trying the other option. See parseMaybeAssign override.

1. Scan `<`. If not `<`, backtrack and try other options. Note: `<<` is invalid here because we are expecting type parameters rather than type arguments.
2. Continue parsing towards the end of the arrow function. If there is a syntax error, backtrack and try the other option.
