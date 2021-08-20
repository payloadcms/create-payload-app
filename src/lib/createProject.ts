import path from 'path'
import chalk from 'chalk'
import fse from 'fs-extra'
import execa from 'execa'
import ora from 'ora'

import { success, error, warning } from '../utils/log'
import { setTags } from '../utils/usage'
import { CliArgs } from '../types'

function createProjectDir(projectDir: string) {
  fse.mkdirpSync(projectDir)
  const readDir = fse.readdirSync(projectDir)
  if (readDir && readDir.length > 0) {
    error(`The project directory '${projectDir}' is not empty`)
    process.exit(1)
  }
}

async function installDeps(
  args: CliArgs,
  dir: string,
  packageManager: string,
): Promise<boolean> {
  if (args['--no-deps']) {
    return true
  }
  let cmd = packageManager === 'yarn' ? 'yarn' : 'npm install --legacy-peer-deps'

  try {
    await execa.command(cmd, {
      cwd: path.resolve(dir),
    })
    return true
  } catch (error: unknown) {
    return false
  }
}

async function getLatestPayloadVersion(): Promise<false | string> {
  try {
    const { stdout } = await execa('npm info payload version', [], { shell: true })
    return `^${stdout}`
  } catch (error: unknown) {
    return false
  }
}

async function updatePayloadVersion(projectDir: string) {
  const payloadVersion = await getLatestPayloadVersion()
  if (!payloadVersion) {
    warning(
      'Error retrieving latest Payload version. Please update your package.json manually.',
    )
    return
  }
  setTags({ payload_version: payloadVersion })

  const pjson = path.resolve(projectDir, 'package.json')
  try {
    const packageObj = await fse.readJson(pjson)
    packageObj.dependencies.payload = payloadVersion
    await fse.writeJson(pjson, packageObj, { spaces: 2 })
  } catch (err) {
    warning(
      'Unable to write Payload version to package.json. Please update your package.json manually.',
    )
  }
}

export async function createProject(
  args: CliArgs,
  projectDir: string,
  template: string,
  packageManager: string,
) {
  createProjectDir(projectDir)
  const templateDir = path.resolve(__dirname, `../templates/${template}`)

  console.log(
    `\n  Creating a new Payload app in ${chalk.green(path.resolve(projectDir))}\n`,
  )

  try {
    await fse.copy(templateDir, projectDir)
    success('Project directory created')
  } catch (err) {
    const msg =
      'Unable to copy template files. Please check template name or directory permissions.'
    error(msg)
    process.exit(1)
  }

  const spinner = ora('Checking latest Payload version...').start()
  await updatePayloadVersion(projectDir)

  spinner.text = 'Installing dependencies...'
  const result = await installDeps(args, projectDir, packageManager)
  spinner.stop()
  spinner.clear()
  if (result) {
    success('Dependencies installed')
  } else {
    error('Error installing dependencies')
  }
}
