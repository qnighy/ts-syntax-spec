# Ambiguity of `(` at the start of an expression

## Symptom

`(` can be one of the following:

- `(x)`, a parenthesized expression
- `(x) => x`, an arrow function

The content of the parentheses can be more complex: `({ x: y = 1, z })` and still ambiguous.

## ECMAScript

ECMAScript uses a cover grammar [CoverParenthesizedExpressionAndArrowParameterList](https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#prod-CoverParenthesizedExpressionAndArrowParameterList) to parse the input while deferring the disambiguation until the parser is able to see the distinguishing token (the `=>`).

## Extending cover grammars

It is possible to extend the cover grammar to avoid backtracking in TypeScript in this case. This is because all the TypeScript-specific parameters can be detected in the first pass:

- If the parameter is optional, the expression is followed by `?` and then one of `:`, `=`, `,`, or `)` (though `=` is invalid in this case). This `?` cannot be a part of a conditional.
- Otherwise, if the parameter has a type annotation, the expression is followed by `:`, and this `:` is preceded by one of Identifier, `]`, `}`, or `this`. This `:` cannot be  a part of a return type annotation of an arrow function or an async arrow function. It cannot be confused with the second operator of a conditional expression because `:` must be paired with a `?` whose presence we already know at this point.

Thus we don't need an additional conflict-resolution rules for this case. We'll only briefly describe each implementation's approach.

## Implementations

- TSC uses backtracking for disambiguation. See tryParseParenthesizedArrowFunctionExpression.
- Babel extends the cover grammar. See overrides for parseConditional and parseParenItem.
