import Conf from 'conf'
import { randomBytes } from 'crypto'

export type Event = {
  type: string
  envID: string
  nodeVersion: string
  packageManager: string
  payloadVersion?: string
  template: string
}

type Args = {
  template: string
  packageManager: string
  payloadVersion?: string
}

export const sendEvent = async ({
  template,
  payloadVersion,
  packageManager,
}: Args): Promise<void> => {
  try {
    const cpaEvent: Event = {
      type: 'create-payload-app',
      template,
      payloadVersion,
      packageManager,
      envID: getEnvID(),
      nodeVersion: process.version,
    }

    await fetch('https://telemetry.payloadcms.com/events', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cpaEvent),
    })
  } catch (_) {
    // Eat any errors in sending telemetry event
  }
}

/**
 * This is a quasi-persistent identifier used to dedupe recurring events. It's
 * generated from random data and completely anonymous.
 */
const getEnvID = (): string => {
  const conf = new Conf()
  const ENV_ID = 'envID'

  const val = conf.get(ENV_ID)
  if (val) {
    return val as string
  }

  const generated = randomBytes(32).toString('hex')
  conf.set(ENV_ID, generated)
  return generated
}
