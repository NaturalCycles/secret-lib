import { pMap } from '@naturalcycles/promise-lib'
import * as fs from 'fs-extra'
import globby from 'globby'
import * as path from 'path'
import * as yargs from 'yargs'
import { securityService } from './security.service'

export async function secretsDecryptCLI (): Promise<void> {
  const cwd = process.cwd()

  const { dir, encKey, algorithm } = yargs
    .option('dir', {
      type: 'string',
      // demandOption: true,
      default: `${cwd}/secret`,
    })
    .option('encKey', {
      type: 'string',
      demandOption: true,
      default: process.env.SECRET_ENCRYPTION_KEY!,
    })
    .option('algorithm', {
      type: 'string',
      default: 'aes-256-cbc',
    }).argv

  await secretsDecrypt(dir, encKey, algorithm)
}

export async function secretsDecrypt (
  dir: string,
  encKey: string,
  algorithm?: string,
): Promise<void> {
  const patterns = [
    `${dir}/*.enc`, // only encrypted files
  ]
  const filenames = await globby(patterns)

  await pMap(filenames, async filename => {
    const enc = await fs.readFile(filename)
    const plain = securityService.decryptBuffer(enc, encKey, algorithm)

    const plainFilename = filename.substr(0, filename.length - '.enc'.length)
    await fs.writeFile(plainFilename, plain)
    console.log(`${path.basename(filename)} > ${path.basename(plainFilename)}`)
  })

  console.log(`decrypted ${filenames.length} files`)
}
