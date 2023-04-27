function parse(value: string) {
  if (/^[+-]?(\d|([1-9]\d+))(\.\d+)?$/.test(value))
    return 'number'
  if (['true', 'false'].includes(value))
    return 'boolean'
  return 'string'
}

function interfaceFields(obj: Record<string, string>, space = '  ') {
  return Object.entries(obj).map(([key, value]) => `readonly '${key}': ${parse(value)}`).map(i => space + i).join('\n')
}

export function generate(env: Record<string, string>) {
  const processEnvEntries = Object.keys(env)
    .filter(key => !key.startsWith('npm_'))
    .filter(key => !key.startsWith('ProgramFiles'))
    .filter(key => !key.startsWith('CommonProgramFiles'))
    .filter(key => !key.startsWith('VSCODE_'))
    .map(key => [key, env[key]])

  const processEnv = Object.fromEntries(processEnvEntries)

  const metaEnvEntries = Object.keys(processEnv)
    .filter(key => key.startsWith('VITE_'))
    .map(key => [key, processEnv[key]])
  const metaEnv = Object.fromEntries(metaEnvEntries)
  // \n' + items.map(i => '  ' + i).join('\n') + '\n
  return `// Generated by unplugin-env-parsing
  export {}
  declare global {
    namespace NodeJS {
      interface ProcessEnv {
${interfaceFields(processEnv, '        ')}
      }
    }
    interface ImportMetaEnv {
${interfaceFields(metaEnv, '      ')}
    }
  }`
}
