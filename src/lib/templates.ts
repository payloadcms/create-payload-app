import path from 'path'
import fs from 'fs'
import { error, info } from '../utils/log'

export async function validateTemplate(templateName: string) {
  const validTemplates = await getValidTemplates()
  if (!validTemplates.includes(templateName)) {
    error(`'${templateName}' is not a valid template.`)
    info(`Valid templates: ${validTemplates.join(', ')}`)
    return false
  }
  return true
}

export async function getValidTemplates() {
  const templateDir = path.resolve(__dirname, '../templates')
  return getDirectories(templateDir)
}

function getDirectories(dir: string) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(dir + '/' + file).isDirectory()
  })
}
