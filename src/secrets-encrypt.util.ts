import { pMap } from '@naturalcycles/promise-lib'
import * as fs from 'fs-extra'
import globby from 'globby'
import * as path from 'path'
import { encryptBuffer } from './security.util'
import { getEncryptCLIParams } from './util'

export async function secretsEncryptCLI (): Promise<void> {
  const { dir, encKey, algorithm } = getEncryptCLIParams()

  await secretsEncrypt(dir, encKey, algorithm)
}

/**
 * Encrypts all files in given directory (except *.enc), saves encrypted versions as filename.ext.enc.
 * Using provided encKey.
 */
export async function secretsEncrypt (
  dir: string,
  encKey: string,
  algorithm?: string,
): Promise<void> {
  const patterns = [
    dir, // target directory
    `!${dir}/**/*.enc`, // excluding already encoded
  ]
  const filenames = await globby(patterns)

  await pMap(filenames, async filename => {
    const plain = await fs.readFile(filename)
    const enc = await encryptBuffer(plain, encKey, algorithm)

    const encFilename = `${filename}.enc`
    await fs.writeFile(encFilename, enc)
    console.log(`${path.basename(filename)} > ${path.basename(encFilename)}`)
  })

  console.log(`encrypted ${filenames.length} files`)
}
