# Getting Started

## Overview

Validate Any is an npm package that checks types in runtime, returning you mainly three things

-   Whether the validation was a success `(boolean)`
-   The validation errors if any `(array)`
-   The data that was passed in with TypeScript annotations generated by the schema `(any)`

## Installation

<code-group>
<code-block title="npm">
```bash
npm i validate-any
```
</code-block>

<code-block title="yarn">
```bash
yarn add validate-any
```
</code-block>

<code-block title="pnpm">
```bash
pnpm i validate-any
```
</code-block>
</code-group>

## Usage

```js
// ES6 Import
import { validate } from "validate-any"

// Node Require
const { validate } = require("validate-any")
```
