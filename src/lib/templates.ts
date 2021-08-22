import path from 'path'
import fs from 'fs'
import { error, info } from '../utils/log'
import { ProjectTemplate } from '../types'

export async function validateTemplate(templateName: string) {
  const validTemplates = await getValidTemplates()
  if (!validTemplates.map(t => t.name).includes(templateName)) {
    error(`'${templateName}' is not a valid template.`)
    info(`Valid templates: ${validTemplates.join(', ')}`)
    return false
  }
  return true
}

export async function getValidTemplates() {
  const templateDir = path.resolve(__dirname, '../templates')
  const dirs = getDirectories(templateDir)
  const templates: ProjectTemplate[] = dirs.map(name => {
    return { name, type: 'template', url: undefined }
  })
  // TODO: Retrieve this dynamically
  templates.push({
    name: 'ts-nextjs',
    type: 'starter',
    url: 'git@github.com:payloadcms/nextjs-custom-server.git',
  })
  return templates
}

function getDirectories(dir: string) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(dir + '/' + file).isDirectory()
  })
}
