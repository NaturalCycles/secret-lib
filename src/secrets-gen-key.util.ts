import { generateSecretKeyBase64 } from '@naturalcycles/nodejs-lib'
import { dimGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import * as yargs from 'yargs'

export async function secretsGenKeyCLI(): Promise<void> {
  const { sizeBytes } = yargs.option('sizeBytes', {
    type: 'number',
    default: 256,
  }).argv

  const key = await generateSecretKeyBase64(sizeBytes)

  console.log(dimGrey('\nSECRET_ENCRYPTION_KEY:\n'))
  console.log(key, '\n')
}
