import { pMap } from '@naturalcycles/promise-lib'
import * as fs from 'fs-extra'
import globby from 'globby'
import * as path from 'path'
import { decryptBuffer } from './security.util'
import { getEncryptCLIParams } from './util'

export async function secretsDecryptCLI (): Promise<void> {
  const { dir, encKey, algorithm } = getEncryptCLIParams()

  await secretsDecrypt(dir, encKey, algorithm)
}

/**
 * Decrypts all files in given directory (*.enc), saves decrypted versions without ending `.enc`.
 * Using provided encKey.
 */
export async function secretsDecrypt (
  dir: string,
  encKey: string,
  algorithm?: string,
): Promise<void> {
  const patterns = [
    `${dir}/**/*.enc`, // only encrypted files
  ]
  const filenames = await globby(patterns)

  await pMap(filenames, async filename => {
    const enc = await fs.readFile(filename)
    const plain = decryptBuffer(enc, encKey, algorithm)

    const plainFilename = filename.substr(0, filename.length - '.enc'.length)
    await fs.writeFile(plainFilename, plain)
    console.log(`${path.basename(filename)} > ${path.basename(plainFilename)}`)
  })

  console.log(`decrypted ${filenames.length} files`)
}
