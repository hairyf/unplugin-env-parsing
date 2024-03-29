import { parse } from './utils'

function interfaceFields(
  obj: Record<string, any>,
  space = '  ',
) {
  return Object.entries(obj).map(([key, value]) => `readonly '${key}': ${typeof parse(value)}`).map(i => space + i).join('\n')
}

export function generate(env: Record<string, string>, framework: 'vite' | 'esbuild' | 'webpack' | 'rollup') {
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
  const viteCode = `interface ImportMetaEnv {
${interfaceFields(metaEnv, '    ')}
  }`

  // \n' + items.map(i => '  ' + i).join('\n') + '\n
  return `\
// Generated by unplugin-env-parsing
export {}
declare global {
  ${framework === 'vite' ? `${viteCode}\n` : ''}\
  namespace NodeJS {
    interface ProcessEnv {
${interfaceFields(processEnv, '      ')}
    }
  }
}`
}
