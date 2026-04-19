# TypeScript Syntax Ambiguities

This document lists syntax ambiguities in TypeScript syntax, and how they are resolved.

- `async(` (classic ambiguity)
- `(` at the start of an expression (classic ambiguity)
- `:` after parenthesized parameters
- `<` after an expression
- `async<`
- `<` at the start of an expression (JSX off)
- `<` at the start of an expression (JSX on)

## `async(` (classic ambiguity)

Symptom: `async(` can be one of the following:

- `async(x, y)`, a function call
- `async (x, y) => x + y`, an async arrow function

The content of the parentheses can be more complex: `async({ x: y = 1, z })` and still ambiguous.

See [async-paren.md](./ambiguities/async-paren.md) for details.

## `(` at the start of an expression (classic ambiguity)

Symptom: `(` can be one of the following:

- `(x)`, a parenthesized expression
- `(x) => x`, an arrow function

The content of the parentheses can be more complex: `({ x: y = 1, z })` and still ambiguous.

## `:` after parenthesized parameters

Symptom: `):`  can be one of the following:

- `(x): 0 => 0`, a return type annotation of an arrow function or an async arrow function
- `0 ? (x) : 0`, the second operator of a conditional expression

Note: this is not a real ambiguity because the disambiguation rule is purely based on the already consumed parts.

## `<` after an expression

Symptom: `<` can be one of the following:

- `f<T>(x)`, type arguments in a call-like expression (a call expression, a new expression, a tagged template expression, or an optional or chained variant of them) or an instantiation expression
- `f < T > (x)`, a less-than operator

Note: the example above is completely ambiguous, meaning that even after consuming the entire input, it is still ambiguous. As a result, the disambiguation rule explicitly rules out some uses of less-than operators that would be accepted in ECMAScript.

Note: more complex example, such as `f(g<0, 0>(1 + 1))`, shows that the angle brackets can appear in a way that would be interpreted as operators more naturally.

## `async<`

Symptom: in addition to the cases above, `async<` adds another ambiguity:

- `async<T>(x) => x`, an async arrow function with type parameters

## `<` at the start of an expression (JSX off)

Symptom: `<` can be one of the following:

- `<T>(x) => x`, an arrow function with type parameters
- `<T>(x)`, a legacy type assertion

## `<` at the start of an expression (JSX on)

Symptom: `<` can be one of the following:

- `<T>(x) => x`, an arrow function with type parameters
- `<T>(x)</T>`, a JSX element
