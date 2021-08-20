import prompts from 'prompts'
import { CliArgs } from '../types'

export async function parseProjectName(args: CliArgs): Promise<string> {
  if (args['--name']) return args['--name']
  if (args._[0]) return args._[0]

  const response = await prompts(
    {
      type: 'text',
      name: 'value',
      message: 'Project name?',
      validate: (value: string) => value.length,
    },
    {
      onCancel: () => {
        process.exit(0)
      },
    },
  )

  return response.value
}
