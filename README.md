## Unofficial and Detailed TypeScript Syntax and Runtime Semantics

This repository contains a detailed specification of TypeScript syntax and runtime semantics, which is **not** an official specification but is based on the major TypeScript parsers in the wild. It serves as a reference for understanding how TypeScript code is parsed and executed.

You can read the specification at https://qnighy.github.io/ts-syntax-spec/.

## Important Notes

- This specification is **not** authoritative by any means. Do not report bugs to TypeScript parsers solely based on this specification. Instead, you are responsible for claiming what is the most appropriate behavior, by comparing the behavior of different parsers and giving architectural insights.
- **Type system is out of scope** of this specification. You can only learn how TypeScript code is transpiled to JavaScript and how the syntax of TypeScript code is checked at a bare minimum level.

## Scope

In the scope (including those that are not yet covered):

- TypeScript
  - Syntax
  - Runtime semantics
- JSX
  - Syntax
  - Runtime semantics shared by UI frameworks
- TSX Syntax (TypeScript + JSX)
- CommonJS Modules
  - Syntax
    - "Unambiguous" transpiled CommonJS Modules syntax and runtime semantics
    - CommonJS Modules-specific TypeScript syntax extensions and their runtime semantics

Out of the scope:

- Type system
- UI framework-specific JSX semantics
- CommonJS Modules module resolution

## Status

- [x] Notational Conventions
  - [x] Backtracking
  - [x] Syntax Mapping
  - [x] Syntax Context
- [ ] Syntax Contexts
  - [x] TypeScript
  - [x] JSX
  - [ ] Legacy class field semantics
  - [ ] Non-verbatim syntaxes
  - [ ] Non-isolated-modules syntaxes
- [x] Extension of Syntax-Directed Operations
- [x] Modify `Function.prototype.toString`
- [x] Modify Forbidden Extensions
- [ ] Ambiguities
  - [x] `async(` (classic ambiguity)
  - [x] `(` at the start of an expression (classic ambiguity)
  - [ ] `:` after parenthesized parameters
  - [x] `<` after an expression
  - [ ] `async<`
  - [ ] `<` at the start of an expression (JSX off)
  - [x] `<` at the start of an expression (JSX on)
- [ ] Types
  - [x] Most types
  - [x] Infer type constraints
  - [x] Type argument lookahead rules
  - [ ] Uniqueness constraint of type parameters
  - [ ] Streamline tuple type structure
- [x] Expressions
  - [x] JSX
  - [x] Non-nullish assertion
  - [x] Type arguments in calls and instantiation expression
  - [x] Legacy type assertion
  - [x] `as` and `satisfies` expressions
- [ ] Statements and Declarations
  - [x] Variable statement extensions
  - [x] For extensions
  - [x] Catch extensions
  - [ ] Type aliases
  - [ ] Interfaces
  - [ ] Namespaces
  - [ ] Ambient globals
  - [ ] Ambient modules, as declared in non-modules
  - [ ] Ambient module augmentations
  - [x] Ambient variable declarations
  - [ ] Enums
- [ ] Functions and Methods
  - [x] Basic Function extensions
  - [x] Async-specific extensions
  - [x] Generator-specific extensions
  - [x] Arrow-specific extensions
  - [ ] Extension of arrow function semantics
  - [x] Method-specific extensions
  - [x] Accessors
  - [x] Constructors
  - [ ] Constructor parameter properties
  - [x] Ambient functions and overloads
- [ ] Classes
  - [ ] Class type parameters
  - [ ] Class type arguments
  - [ ] Class modifiers
  - [ ] New heritages
  - [ ] Ambient class elements and overloads
  - [ ] Class element initialization assertion
  - [ ] Class element optionality
  - [ ] Class element type annotations
  - [ ] Class element modifiers
  - [ ] Ambient classes
- [ ] Scripts and Modules
  - [ ] Type-only imports and exports
  - [ ] CommonJS interpretations and special syntax
- [ ] Permissive Grammars

## Contributing

The most important contribution is to resolve this whole mess of standardization among the parsers. Remember that this means persuading at least one author of a parser to change their mind, and this is not an easy task because nothing is authoritative here. This specification is really helpful for finding problems in standardization, but not for resolving them.
