import { error, info } from '../utils/log'
import type { GitTemplate, ProjectTemplate } from '../types'

export async function validateTemplate(templateName: string): Promise<boolean> {
  const validTemplates = await getValidTemplates()
  if (!validTemplates.map(t => t.name).includes(templateName)) {
    error(`'${templateName}' is not a valid template.`)
    info(`Valid templates: ${validTemplates.map(t => t.name).join(', ')}`)
    return false
  }
  return true
}

export async function getValidTemplates(): Promise<ProjectTemplate[]> {
  const templates: ProjectTemplate[] = [
    {
      name: 'blank',
      language: 'typescript',
      type: 'static',
      description: 'Blank',
      directory: 'ts-blank',
    },
    {
      name: 'todo',
      language: 'typescript',
      type: 'static',
      description: 'Todo list',
      directory: 'ts-todo',
    },
    {
      name: 'blog',
      language: 'typescript',
      type: 'static',
      description: 'Blog',
      directory: 'ts-blog',
    },
  ]

  const starters: GitTemplate[] = [
    {
      name: 'payload-demo',
      type: 'starter',
      language: 'typescript',
      url: 'https://github.com/payloadcms/public-demo',
      description: 'Payload demo site at https://demo.payloadcms.com',
    },
    {
      name: 'payload-website',
      type: 'starter',
      language: 'typescript',
      url: 'https://github.com/payloadcms/website-cms',
      description: 'Payload website CMS at https://payloadcms.com',
    },
  ]

  return [...templates, ...starters]
}
