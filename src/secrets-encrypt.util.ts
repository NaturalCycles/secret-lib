import { pMap } from '@naturalcycles/promise-lib'
import * as fs from 'fs-extra'
import globby from 'globby'
import * as path from 'path'
import { encryptBuffer } from './security.util'
import { getEncryptCLIOptions } from './util'

export async function secretsEncryptCLI (): Promise<void> {
  const { dirs, encKey, algorithm, del } = getEncryptCLIOptions()

  await pMap(dirs, dir => secretsEncrypt(dir, encKey, algorithm, del), { concurrency: 1 })
}

/**
 * Encrypts all files in given directory (except *.enc), saves encrypted versions as filename.ext.enc.
 * Using provided encKey.
 */
export async function secretsEncrypt (
  dir: string,
  encKey: string,
  algorithm?: string,
  del?: boolean,
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

    if (del) {
      await fs.unlink(filename)
    }

    console.log(`${path.basename(filename)} > ${path.basename(encFilename)}`)
  })

  console.log(`encrypted ${filenames.length} files in ${dir}`)
}
