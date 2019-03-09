import { pMap } from '@naturalcycles/promise-lib'
import * as fs from 'fs-extra'
import globby from 'globby'
import * as path from 'path'
import * as yargs from 'yargs'
import { securityService } from './security.service'

export async function secretsEncryptCLI (): Promise<void> {
  const cwd = process.cwd()

  const { dir, encKeyBase64, algorithm } = yargs
    .option('dir', {
      type: 'string',
      // demandOption: true,
      default: `${cwd}/secret`,
    })
    .option('encKeyBase64', {
      type: 'string',
      demandOption: true,
      default: process.env.SECRET_ENCRYPTION_KEY!,
    })
    .option('algorithm', {
      type: 'string',
      default: 'aes-256-cbc',
    }).argv

  await secretsEncrypt(dir, encKeyBase64, algorithm)
}

/**
 * Encrypts all files in given directory (except *.enc), saves encrypted versions as filename.ext.enc.
 * Using provided encKey.
 */
export async function secretsEncrypt (
  dir: string,
  encKeyBase64: string,
  algorithm?: string,
): Promise<void> {
  const patterns = [
    dir, // target directory
    `!${dir}/**/*.enc`, // excluding already encoded
  ]
  const filenames = await globby(patterns)

  await pMap(filenames, async filename => {
    const plain = await fs.readFile(filename)
    const enc = await securityService.encryptBuffer(plain, encKeyBase64, algorithm)

    const encFilename = `${filename}.enc`
    await fs.writeFile(encFilename, enc)
    console.log(`${path.basename(filename)} > ${path.basename(encFilename)}`)
  })

  console.log(`encrypted ${filenames.length} files`)
}
