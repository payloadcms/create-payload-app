import slugify from '@sindresorhus/slugify'
import fs from 'fs-extra'
import { error, success } from '../utils/log'

export async function writeEnvFile(
  projectName: string,
  databaseUri: string,
  payloadSecret: string,
) {
  const content = `MONGODB_URI=${databaseUri}\nPAYLOAD_SECRET=${payloadSecret}`

  try {
    const projectDir = `./${slugify(projectName)}`
    await fs.outputFile(`${projectDir}/.env`, content)
    success('.env file created')
  } catch (err) {
    error('Unable to write .env file')
    error(err)
    process.exit(1)
  }
  return
}
