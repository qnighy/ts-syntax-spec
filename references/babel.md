# How to read Babel.js

The submodule is located at references/babel.

## Important files

```
packages/
  babel-parser/
    src/
      parser/
        expression.ts # parsing of expressions.
        statement.ts  # parsing of statements and declarations.
      plugins/
        typescript/
          index.ts # parsing of TypeScript-specific syntax.
```
