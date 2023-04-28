import { cyan, red, yellow } from 'kolorist'
import type { ZodSchema } from 'zod'
import { parse } from './utils'

export function errorReporter(errors: any[]) {
  let finalMessage = red('\n\n[unplugin-env-parsing] Failed to validate environment variables: \n\n')

  for (const error of errors) {
    finalMessage += `${cyan(`${error.key}: `)}`

    const message = error.err.message.replace(`${error.err.code}: `, '')
    finalMessage += `${yellow(message)}\n`
  }

  return finalMessage as string
}

export function validation(env: Record<string, string>, schema: Record<string, ZodSchema>) {
  const errors: any[] = []
  for (const [key, validator] of Object.entries(schema!)) {
    const result = validator.safeParse(parse(env[key]))

    if (!result.success) {
      errors.push({ key, err: result.error })
      continue
    }

    process.env[key] = result.data
  }

  if (errors.length)
    throw new Error(errorReporter(errors))
}
