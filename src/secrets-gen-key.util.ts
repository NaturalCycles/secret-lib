import { generateSecretKeyBase64 } from '@naturalcycles/nodejs-lib'
import * as yargs from 'yargs'

export async function secretsGenKeyCLI (): Promise<void> {
  const { sizeBytes } = yargs.option('sizeBytes', {
    type: 'number',
    default: 256,
  }).argv

  const key = await generateSecretKeyBase64(sizeBytes)

  console.log('\nSECRET_ENCRYPTION_KEY:\n')
  console.log(key, '\n')
}
