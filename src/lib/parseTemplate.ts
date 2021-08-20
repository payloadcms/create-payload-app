import prompts from 'prompts'
import { CliArgs } from '../types'
import { setTags } from '../utils/usage'

export async function parseTemplate(
  args: CliArgs,
  validTemplates: string[],
  language: string,
): Promise<string> {
  if (args['--template']) {
    const template = args['--template']
    setTags({ template })
    return template
  }

  console.log('validTemplates', validTemplates)
  const filteredTemplates = validTemplates
    .filter(d => d.startsWith(language))
    .map(t => t.replace(`${language}-`, ''))

  const response = await prompts(
    {
      type: 'select',
      name: 'value',
      message: 'Choose project template',
      choices: filteredTemplates.map(p => {
        return { title: p, value: p }
      }),
      validate: (value: string) => value.length,
    },
    {
      onCancel: () => {
        process.exit(0)
      },
    },
  )

  const template = `${language}-${response.value}`
  setTags({ template })

  return template
}
