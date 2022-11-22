import path from 'path'
import fs from 'fs-extra'
import type { ProjectTemplate } from '../types'
import { error, success } from '../utils/log'

export async function writeEnvFile(args: {
  databaseUri: string
  payloadSecret: string
  template: ProjectTemplate
  projectDir: string
}): Promise<void> {
  const { databaseUri, payloadSecret, template, projectDir } = args
  try {
    if (
      template.type === 'starter' &&
      fs.existsSync(path.join(projectDir, '.env.example'))
    ) {
      await fs.copyFile(
        path.join(projectDir, '.env.example'),
        path.join(projectDir, '.env'),
      )
      return
    }

    const content = `MONGODB_URI=${databaseUri}\nPAYLOAD_SECRET=${payloadSecret}`

    await fs.outputFile(`${projectDir}/.env`, content)
    success('.env file created')
  } catch (err: unknown) {
    error('Unable to write .env file')
    if (err instanceof Error) {
      error(err.message)
    }
    process.exit(1)
  }
}
