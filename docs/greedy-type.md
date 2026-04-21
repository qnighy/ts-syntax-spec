# Greedy parsing of Type

`as` and `satisfies` accept Type with greedy parsing. This article analyzes how this works with existing syntax.

## Type postfix and infix

A token that can follow a Type to form another Type is a primary interest in this article. The following tokens are such tokens:

- `.` (within type references)
- `<` (within type references)
- `[`
- `&`
- `|`
- `=>` (due to function type ambiguity)
- `extends`

Additionally, TSC consumes the following token for JSDoc support:

- `!`
- `?` when it is followed by a "start of a type" token

Among these tokens, except for JSDoc-specific tokens, only `<`, `&` and `|` can be problematic for greedy parsing of Type due to their precedence in the Expression grammar.

## contextual greediness of `<`

Consumption of `<` is contextual. See:

- `0 as Readonly<0>`
- `0 as number < 0`

## near-universal consumption of `&` and `|`

`&` and `|` are consumed universally after any Type, except after `asserts X`. The proof is a structural induction over AST:

- For UnionType, for `|`, there is exact production that consumes `|` to form another UnionType.
- For UnionType, for `&`, notice every production ends with IntersectionType. From the induction hypothesis, IntersectionType can consume `&` to form another IntersectionType, resulting a new UnionType as well.
- For IntersectionType, for `&`, there is exact production that consumes `&` to form another IntersectionType.
- For FunctionType and ConstructorType, the return type is one of the following:
  - If the return type is a Type, we can use the induction hypothesis to consume `&` and `|`.
  - If the return type is `x is Type` or `asserts x is Type`, we can also use the induction hypothesis to consume `&` and `|`.
  - If the return type is `asserts X`, this is the exception as assumed in the statement of the proposition.
- For ConditionalType, we can inductively consume `&` or `|` in the "else" branch, which is a Type.

Additionally for `asserts X` case, `|` cannot follow it in TSC because TSC first parses `asserts X` as a PrimaryType and then validates its position. As a result, we can require the whole AsExpression not to be followed by `|` or `&` using a negative lookahead rule.

## `as` and `satisfies` precedence

`as` and `satisfies` look like binary operators of relational precedence. This is an incorrect observation.

As we discussed earlier, continuation tokens for Type are largely different from those for Expression. Therefore, `as` and `satisfies` are more like suffix operators than infix. And unary operators are much more asymmetric in left and right than binary operators: they can have totally different precedences on either side. More precisely for `as` and `satisfies`: it is at relational precedence on the left, but at exponentiation precedence on the right.

For example, `1 + 1 as number / 2` is parsed as `((1 + 1) as number) / 2` and then transpiled down to `(1 + 1) / 2`.
