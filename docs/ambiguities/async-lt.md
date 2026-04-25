## `async<` ambiguity

## Symptom

In addition to the cases in [expr-lt.md](./ambiguities/expr-lt.md), `async<` adds another ambiguity:

- `async<T>(x) => x`, an async arrow function with type parameters

## TSC

If the operand is `async`, TSC tries to parse generic async arrow functions before trying other options. See tryParseParenthesizedArrowFunctionExpression.

1. Scan `async`. If not `async`, try other options.
2. Scan `<`. If not `<`, backtrack and try other options. Note: `<<` is invalid here because we are expecting type parameters rather than type arguments.
3. If `async` and `<` are in different lines, backtrack and try other options.
4. Oops, JSX branch here too! Use the following procedures if JSX is enabled:
  1. If the next token is not IdentifierReference or `const`, backtrack and try other options.
  2. Consume `const` if it is there.
  3. We should also have a check for IdentifierReference here, but currently there isn't one.
  4. If `extends` follows and the token following it is not `=`, `>` (including `>>`, `>>>`, `>>=`, and `>=`), or `/`, it is a generic async arrow function.
  5. Otherwise, if the next token is `,` or `=`, it is a generic async arrow function.
  6. Otherwise, backtrack and try other options.
5. If the next token is not IdentifierReference or `const`, backtrack and try other options.
6. Permissively scan comma-delimited list of type parameters. It may yield errors, but we will continue parsing anyway. The result is that the position is advanced according to the permissive grammar.
7. Scan `>`, rescanning `>>`, `>>>`, `>>=`, and `>=` as `>` if necessary. If there is no `>`, continue anyway.
8. Scan `(`. If not `(`, backtrack and try other options.
9. Scan comma-delimited list of parameters. If a "start of a parameter name" token (`this`, IdentifierReference, `{`, or `[`) is not found at the beginning of a parameter, backtrack and try other options.
10. Scan `)`. If not `)`, backtrack and try other options.
11. If there is `:`, permissively parse a return type annotation. If the type has a specific type of syntax error or has a specific form, backtrack and try other options.
  - The following is "arrow function blocking parse error" condition:
    - If the type is empty, it blocks arrow functions.
    - It the type is a function type or a constructor type and it lacks a parameter list, it blocks arrow functions.
    - If the type is a function type or a constructor type and its return type recursively satisfies the "arrow function blocking parse error" condition, it blocks arrow functions.
    - If the type is a parenthesized type and its element type recursively satisfies the "arrow function blocking parse error" condition, it blocks arrow functions.
  - If the type is a JSDoc function type (`function()`) arbitrarily nesteed in parentheses and the next token is `{`, backtrack and try other options.
12. Scan `=>`. If the next token is not `=>` or `{`, backtrack and try other options. If the next token is `{`, don't consume it and continue anyway.
13. Final rescan opportunity for `:`: if it is a context where an else branch of a conditional expression is allowed, a return type annotation is found anyway, and the next token is not `:`, backtrack and try other options.
14. Otherwise, it is definitely a generic async arrow function.

The algorithm is shared with the `<` case, see [lt-without-jsx.md](./ambiguities/lt-without-jsx.md) and [lt-with-jsx.md](./ambiguities/lt-with-jsx.md) for details.

## Babel

If the operand is `async`, Babel tries to parse generic async arrow functions before trying other options. See parseSubscript override.

1. Scan `async`. If not `async`, try other options.
2. Scan `<`. If not `<`, backtrack and try other options. Note: `<<` is invalid here because we are expecting type parameters rather than type arguments.
3. If `async` and `<` are in different lines, backtrack and try other options.
4. Scan comma-delimited list of type parameters. If there is a syntax error, backtrack and try other options.
5. Scan `>`, rescanning `>>`, `>>>`, `>>=`, and `>=` as `>` if necessary. If there is no `>`, backtrack and try other options.
6. Scan `(`. If not `(`, backtrack and try other options.
7. Scan comma-delimited list of parameters. If there is a syntax error, backtrack and try other options.
8. Scan `)`. If not `)`, backtrack and try other options.
9. If there is `:`, parse a return type annotation. If there is a syntax error, backtrack and try other options.
10. Scan `=>`. If the next token is not `=>`, backtrack and try other options.
11. Otherwise, it is definitely a generic async arrow function.
