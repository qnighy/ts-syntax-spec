# Ambiguity of `:` after parenthesized parameters

## Symptom

`):`  can be one of the following:

- `(x): 0 => 0`, a return type annotation of an arrow function or an async arrow function
- `0 ? (x) : 0`, the second operator of a conditional expression

Note: this is not a real ambiguity because the disambiguation rule is purely based on the already consumed parts.

## Disambiguation rule

AssignmentExpression carries an additional flag \[Else\] to indicate whether `:` is expected to be the second operator of the enclosing conditional expression. An occurrence of `:` after CoverParenthesizedExpressionAndArrowParameterList or CoverCallExpressionAndAsyncArrowHead is considered to be a return type annotation if and only if the flag is not set (i.e. \[\~Else\]).
