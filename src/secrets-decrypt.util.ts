import { pMap } from '@naturalcycles/js-lib'
import { decryptRandomIVBuffer } from '@naturalcycles/nodejs-lib'
import * as c from 'chalk'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as path from 'path'
import * as yargs from 'yargs'

export interface DecryptCLIOptions {
  dir: string[]
  encKey: string
  algorithm?: string
  del?: boolean
}

export async function secretsDecryptCLI(): Promise<void> {
  const { dir, encKey, algorithm, del } = getDecryptCLIOptions()

  await secretsDecrypt(dir, encKey, algorithm, del)
}

export function getDecryptCLIOptions(): DecryptCLIOptions {
  require('dotenv').config()

  let { dir, encKey, encKeyVar, algorithm, del } = yargs.options({
    dir: {
      type: 'array',
      desc: 'Directory with secrets. Can be many',
      // demandOption: true,
      default: './secret',
    },
    encKey: {
      type: 'string',
      desc: 'Encryption key',
      // demandOption: true,
      // default: process.env.SECRET_ENCRYPTION_KEY!,
    },
    encKeyVar: {
      type: 'string',
      desc: 'Env variable name to get `encKey` from.',
      default: 'SECRET_ENCRYPTION_KEY',
    },
    algorithm: {
      type: 'string',
      default: 'aes-256-cbc',
    },
    del: {
      type: 'boolean',
      desc: 'Delete source files after encryption/decryption. Be careful!',
    },
  }).argv

  if (!encKey) {
    encKey = process.env[encKeyVar!]

    if (encKey) {
      console.log(`using encKey from env.${c.dim(encKeyVar)}`)
    } else {
      throw new Error(
        `encKey is required. Can be provided as --encKey or env.SECRET_ENCRYPTION_KEY (see readme.md)`,
      )
    }
  }

  // `as any` because @types/yargs can't handle string[] type properly
  return { dir: dir as any, encKey, algorithm, del }
}

/**
 * Decrypts all files in given directory (*.enc), saves decrypted versions without ending `.enc`.
 * Using provided encKey.
 */
export async function secretsDecrypt(
  dir: string[],
  encKey: string,
  algorithm?: string,
  del?: boolean,
): Promise<void> {
  const patterns = dir.map(d => `${d}/**/*.enc`)

  const filenames = await globby(patterns)

  await pMap(filenames, async filename => {
    const enc = await fs.readFile(filename)
    const plain = decryptRandomIVBuffer(enc, encKey, algorithm)

    const plainFilename = filename.substr(0, filename.length - '.enc'.length)
    await fs.writeFile(plainFilename, plain)

    if (del) {
      await fs.unlink(filename)
    }

    console.log(`  ${path.basename(filename)} > ${path.basename(plainFilename)}`)
  })

  console.log(
    `decrypted ${c.bold.white(String(filenames.length))} files in ${c.dim(dir.join(' '))}`,
  )
}
