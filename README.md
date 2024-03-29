# unplugin-env-parsing

[![NPM version](https://img.shields.io/npm/v/unplugin-env-parsing?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-env-parsing)

Parse and verify environment variables for Vite, Webpack, Rollup and esbuild. With TypeScript support. Powered by [unplugin](https://github.com/unjs/unplugin).

## Install

```bash
npm i unplugin-env-parsing
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import EnvParsing from 'unplugin-env-parsing/vite'

export default defineConfig({
  plugins: [
    EnvParsing({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import EnvParsing from 'unplugin-env-parsing/rollup'

export default {
  plugins: [
    EnvParsing({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-env-parsing/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    ['unplugin-env-parsing/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-env-parsing/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import EnvParsing from 'unplugin-env-parsing/esbuild'

build({
  plugins: [EnvParsing()],
})
```

<br></details>

## Basic

Create a `.env` file:

```
API_KEY = qwertyuiop
NEXT_PUBLIC_API_BASE_URL = http://example.com/
VITE_APP_NAME = "name"
VITE_APP_TITLE = "title"
VITE_API_ID = 2
VITE_API_HIDDEN_TABS = false
```

Generate the `env.d.ts` file:

```ts
// Generated by unplugin-env-parsing
export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly API_KEY: string
      readonly NEXT_PUBLIC_API_BASE_URL: string
      readonly VITE_APP_NAME: string
      readonly VITE_APP_TITLE: string
      readonly VITE_API_ID: number
      readonly VITE_API_HIDDEN_TABS: boolean
    }
  }
  interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_APP_TITLE: string
    readonly VITE_API_ID: number
    readonly VITE_API_HIDDEN_TABS: boolean
  }
}
```

## Validate

unplugin-env-parsing uses the `zod` validator, you do not need to install `zod`, and the plugin exports the Z object by default.

you can use it as follows:

```ts
import EnvParsing from 'unplugin-env-parsing/vite'
import { z } from 'unplugin-env-parsing'

export default defineConfig({
  plugins: [
    EnvParsing({
      schema: {
        VITE_MY_STRING: z.string().min(5, 'This is too short !'),
        VITE_ENUM: z.enum(['a', 'b', 'c']),
        VITE_BOOLEAN_VARIABLE: z.boolean(),
        // Custom validator
        VITE_CUSTOM_VARIABLE: z.custom((val: string) => {
          return /^\d+px$/.test(val)
        })
      }
    }),
  ],
})
```

## Transforming variables

In addition to the validation of your variables, there is also a parsing that is done. This means that you can modify the value of an environment variable before it is injected.

Let's imagine the following case: you want to expose a variable VITE_AUTH_API_URL in order to use it to call an API. However, you absolutely need a trailing slash at the end of this environment variable. Here's how it can be done:

```ts
// Built-in validation
import EnvParsing from 'unplugin-env-parsing/vite'
import { z } from 'unplugin-env-parsing'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    EnvParsing({
      schema: {
        VITE_AUTH_API_URL: z
          .string()
          .transform(value => value.endsWith('/') ? value : `${value}/`),
      }
    })
  ]
})
```

## License

[MIT](./LICENSE) License © 2023 [Hairyf](https://github.com/hairyf)
