import * as yargs from 'yargs'
import { securityService } from './security.service'

export async function secretsGenKeyCLI (): Promise<void> {
  const { sizeBytes } = yargs.option('sizeBytes', {
    type: 'number',
    default: 256,
  }).argv

  const key = await securityService.generateSecretKeyBase64(sizeBytes)

  console.log('\nSECRET_ENCRYPTION_KEY:\n')
  console.log(key, '\n')
}
