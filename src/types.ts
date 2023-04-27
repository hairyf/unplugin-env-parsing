import type { ZodSchema } from 'zod'

export interface Options {
  /**
   * .env file suffix (e.g. production -> .env.production)
   *
   * @default "development"
   */
  mode?: string
  /**
   * only load environment variables with corresponding prefixes
   *
   * @default ''
   */
  prefixes?: string | string[]
  /**
   * .env file directory
   *
   * @default process.cwd()
   */
  dir?: string
  /**
   * Generate TypeScript declaration for global
   *
   * @default "env.d.ts"
   */
  dts?: false | string

  /**
   * Infer the schema type from the zod options
   */
  schema?: Record<string, ZodSchema>
}
