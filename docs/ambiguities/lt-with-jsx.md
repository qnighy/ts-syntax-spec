# Ambiguity of `<` at the start of an expression (JSX on)

## Symptom

`<` can be one of the following:

- `<T>(x) => x`, an arrow function with type parameters
- `<T>(x)</T>`, a JSX element

## TSC

TSC tries to parse generic arrow functions before trying the other option. See tryParseParenthesizedArrowFunctionExpression.

1. Scan `<`. If not `<`, backtrack and try other options. Note: `<<` is invalid here because we are expecting type parameters rather than type arguments.
2. If the next token is not IdentifierReference or `const`, backtrack and try other options.
3. Consume `const` if it is there.
4. We should also have a check for IdentifierReference here, but currently there isn't one.
5. If `extends` follows and the token following it is not `=`, `>` (including `>>`, `>>>`, `>>=`, and `>=`), or `/`, it is a generic arrow function.
6. Otherwise, if the next token is `,` or `=`, it is a generic arrow function.
7. Otherwise, backtrack and try other options.

The algorithm is shared with the `async<` case and the `<` case with JSX off, see [async-lt.md](./ambiguities/async-lt.md) and [lt-without-jsx.md](./ambiguities/lt-without-jsx.md) for details.

## Babel

Babel tries to parse JSX before trying the other option. See parseMaybeAssign override.

1. Try to parse an AssignmentExpression starting with JSXElement. If there is no syntax error, return the expression.
2. Otherwise, try to parse a generic arrow function.
  1. Scan `<`. If not `<`, backtrack and go to the failure path. Note: `<<` is invalid here because we are expecting type parameters rather than type arguments.
  2. Continue parsing towards the end of the arrow function. If there is a syntax error, backtrack and go to the failure path.
  3. Validate that the node for type arguments is not in the form of `<T>` or `<const T>`. If it is, backtrack and go to the failure path. In other words, the type parameters must have at least one of: multiple parameters, a default type, a constraint, or a trailing comma.
3. Failure path: report the error as a JSX syntax error.
