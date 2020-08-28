# array-edit-steps

Find the difference between two arrays and compute the minimal steps to transform one array to another.

## Installing

Using npm:

```bash
$ npm install array-edit-steps
```

Using yarn:

```bash
$ yarn add array-edit-steps
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/array-edit-steps/umd/array-edit-steps.min.js"></script>
```

## Usage

```js
const getEditSteps = require('array-edit-steps')

const steps = getEditSteps(['w', 'x', 'y', 'z'], ['x', 'y', 'u', 'v'])

// steps = [
//   [ 'e', 3, 'v' ], -- Edit item at index 3 to 'v' --> ['w', 'x', 'y', 'v']
//   [ 'i', 3, 'u' ], -- Insert 'u' at index 3       --> ['w', 'x', 'y', 'u', 'v']
//   [ 'd', 0 ],      -- Delete item at index 0      --> ['x', 'y', 'u', 'v']
// ]
```

With `equal` function provided as the third argument:

```js
const getEditSteps = require('array-edit-steps')

const steps = getEditSteps(
  [{ id: 1 }, { id: 3 }],
  [{ id: 2 }, { id: 3 }],
  (a, b) => a.id === b.id
)

// steps = [ [ 'e', 0, { id: 2 } ] ]
```

Strings and array-like objects are supported as well.

## TypeScript
array-edit-steps includes [TypeScript](http://typescriptlang.org) definitions.
```typescript
import getEditSteps from 'array-edit-steps'

const steps = getEditSteps('arr', 'array')
```
