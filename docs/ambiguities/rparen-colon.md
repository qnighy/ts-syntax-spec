# Ambiguity of `:` after parenthesized parameters

## Symptom

`):`  can be one of the following:

- `(x): 0 => 0`, a return type annotation of an arrow function or an async arrow function
- `0 ? (x) : 0`, the second operator of a conditional expression

<!-- Note: this is not a real ambiguity because the disambiguation rule is purely based on the already consumed parts. -->

<!-- ## Disambiguation rule -->

<!-- AssignmentExpression carries an additional flag \[Else\] to indicate whether `:` is expected to be the second operator of the enclosing conditional expression. An occurrence of `:` after CoverParenthesizedExpressionAndArrowParameterList or CoverCallExpressionAndAsyncArrowHead is considered to be a return type annotation if and only if the flag is not set (i.e. \[\~Else\]). -->

## TSC

TSC tries to parse arrow functions before trying the other option. See tryParseParenthesizedArrowFunctionExpression and parseParenthesizedArrowFunctionExpression.

1. Assume we have scanned the parenthesized parameter list and the next token is `:`.
2. Scan `:` and try to permissively parse a type annotation. If the type has a specific type of syntax error or has a specific form, backtrack and try the other option.
  - The following is "arrow function blocking parse error" condition:
    - If the type is empty, it blocks arrow functions.
    - It the type is a function type or a constructor type and it lacks a parameter list, it blocks arrow functions.
    - If the type is a function type or a constructor type and its return type recursively satisfies the "arrow function blocking parse error" condition, it blocks arrow functions.
    - If the type is a parenthesized type and its element type recursively satisfies the "arrow function blocking parse error" condition, it blocks arrow functions.
  - If the type is a JSDoc function type (`function()`) arbitrarily nesteed in parentheses and the next token is `{`, backtrack and try other options.
3. Scan `=>` and permissively parse the arrow function body.
4. Check if the next token is not `:` and we are in a context where an ambiguous `:` is disallowed (e.g. the else branch of a conditional expression). If so, backtrack and try the other option.
5. Otherwise, it is definitely an arrow function or an async arrow function with a return type annotation.

The result is that in `0 ? (x0) : x1 => (x2)`, `(x0)` is a parenthesized expression, while:

- In `(x0) : x1 => (x2)`, `(x0)` is a parenthesized parameter list.
- In `0 ? (x0) : x1 => (x2) : x3` or `0 ? (x0) : x1 => (x2) : x3 => 0` too, `(x0)` is a parenthesized parameter list.

Note that the lookahead for `:` is not a sound argument: `0 ? 0 ? (x): x => 0 : 0` is valid in ECMAScript but not currently in TypeScript.

## Babel

Babel's disambiguation is more conservative: it is implemented in shouldParseArrow for non-async arrow functions.

1. Assume we have scanned CoverParenthesizedExpressionAndArrowParameterList and the next token is `:`.
2. If CoverParenthesizedExpressionAndArrowParameterList is ArrowFormalParameters, it is definitely an arrow function.

The result is that Babel rejects more expressions than TSC, such as:

- `0 ? (x0) : x1 => (x2)`
- `0 ? (x0) : x1 => (x2) : x3 => 0`

For async arrow functions, it is implemented in shouldParseAsyncArrow.

1. Assume we have scanned `async(...)` and the next token is `:`.
2. If we are in a "then" branch of a conditional expression, it is a function call. (Or maybe an expression consisting of `async`, `<`, certain tokens, `>` and a parenthesized expression; see [async-lt.md](./ambiguities/async-lt.md) for details.)
3. Otherwise, it is an async arrow function.

The result is that Babel rejects more expressions than TSC, such as:

- `0 ? async (x0) : x1 => (x2)`
- `0 ? async (x0) : x1 => (x2) : x3 => 0`
