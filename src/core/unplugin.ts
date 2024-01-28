import { writeFile } from 'fs/promises'
import path from 'path'
import { createUnplugin } from 'unplugin'
import { loadEnv } from 'vite'
import type { Options } from '../types'
import { generate } from './generate'
import { validation } from './validators'

export const unplugin = createUnplugin<Options | undefined>((options = {}, meta) => {
  const {
    mode = 'development',
    dts = 'env.d.ts',
    dir = process.cwd(),
    schema = {},
    prefixes = '',
  } = options
  function validationEnv() {
    const env = loadEnv(mode, dir, prefixes)
    validation(env, schema)
  }

  async function generateCode() {
    const env = loadEnv(mode, dir, prefixes)
    const code = generate(env, meta.framework)
    if (dts !== false)
      await writeFile(dts, code)
  }

  const envFiles = [
    /** default file */ '.env',
    /** local file */ '.env.local',
    /** mode file */ `.env.${mode}`,
    /** mode local file */ `.env.${mode}.local`,
  ]

  const envFilesIds = envFiles.map(p => path.join(dir, p))

  validationEnv()

  return {
    name: 'unplugin-env-parsing',
    async buildStart() {
      envFilesIds.forEach(file => this.addWatchFile(file))
      await generateCode()
    },
    async watchChange(id) {
      if (!envFilesIds.includes(id))
        return
      await generateCode()
    },
  }
})
