# Ambiguity of `<` after an expression

## Symptom

`<` can be one of the following:

- `f<T>(x)`, type arguments in a call-like expression (a call expression, a new expression, a tagged template expression, or an optional or chained variant of them) or an instantiation expression
- `f < T > (x)`, a less-than operator

Note: the example above is completely ambiguous, meaning that even after consuming the entire input, it is still ambiguous. As a result, the disambiguation rule explicitly rules out some uses of less-than operators that would be accepted in ECMAScript.

Note: more complex example, such as `f(g<0, 0>(1 + 1))`, shows that the angle brackets can appear in a way that would be interpreted as operators more naturally.

Instead of a less-than operator, it might be a shift operator, as seen in `f<<T>(x) => T>(y)`.

## TSC

TSC first tries to parse type arguments and then falls back to parsing a less-than operator or a shift operator.

In parseTypeArgumentsInExpression, the following algorithm is used:

1. Scan `<`, rescanning `<<` as `<` if necessary. If not `<`, there is no type arguments.
2. Permissively scan comma-delimited list of type arguments. It may yield errors, but we will continue parsing anyway. The result is that the position is advanced according to the permissive grammar.
3. Scan `>`, rescanning `>>`, `>>>`, `>>=`, and `>=` as `>` if necessary. In fact, TSC does the opposite: it always scans `>` first and recombines it with the following tokens if necessary. Anyway, if there is no `>`, there is no type arguments and backtrack to the position before `<`.
4. Check if the next token is a "can follow type arguments" token.
  1. `(` and `` ` `` can always follow type arguments.
  2. `<`, `>` (`>>`, `>>>`, `>>>=`, `>>=`, and `>=` implied), `+`, and `-` can never follow type arguments.
  3. Otherwise, if the next token is on the next lines, it can follow type arguments (i.e. considers it ASI).
  4. Otherwise, if the next token is a binary operator, it can follow type arguments.
  5. Otherwise, if the next token is a "start of an expression" token, it cannot follow type arguments.
  6. Otherwise, it can follow type arguments.

## Babel

Babel first tries to parse type arguments and then falls back to parsing a less-than operator or a shift operator.

In parseSubscript override, the following algorithm is used:

1. Scan `<`, rescanning `<<` as `<` if necessary. If not `<`, there is no type arguments.
2. Scan comma-delimited list of type arguments. If there is a syntax error, there is no type arguments and backtrack to the position before `<`.
3. Scan `>`, rescanning `>>`, `>>>`, `>>=`, and `>=` as `>` if necessary. If there is no `>`, there is no type arguments and backtrack to the position before `<`.
4. Check if the next token is a "can follow type arguments" token.
  1. `(`, `` ` ``, `as`, and `satisfies` can always follow type arguments.
  1. `>` and `>>` can never follow type arguments.
  2. Otherwise, if the next token is on the next lines, it can follow type arguments (i.e. considers it ASI).
  3. Otherwise, if the next token is a "start of an expression" token, it cannot follow type arguments.
  4. Otherwise, it can follow type arguments.
