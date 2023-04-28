import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'
import { z } from '../src'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      Inspect(),
      Unplugin({
        mode,
        schema: {
          API_HIDDEN_TABS: z.boolean(),
          API_ID: z.number(),
          VITE_APP_NAME: z.string(),
        },
      }),
    ],
  }
})
