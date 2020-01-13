import { pMap } from '@naturalcycles/js-lib'
import { encryptRandomIVBuffer } from '@naturalcycles/nodejs-lib'
import * as c from 'chalk'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as path from 'path'
import * as yargs from 'yargs'

export interface EncryptCLIOptions {
  pattern: string[]
  encKey: string
  algorithm?: string
  del?: boolean
}

export async function secretsEncryptCLI(): Promise<void> {
  const { pattern, encKey, algorithm, del } = getEncryptCLIOptions()

  await secretsEncrypt(pattern, encKey, algorithm, del)
}

export function getEncryptCLIOptions(): EncryptCLIOptions {
  require('dotenv').config()

  let { pattern, encKey, encKeyVar, algorithm, del } = yargs.options({
    pattern: {
      type: 'string',
      array: true,
      desc: 'Globby pattern for secrets. Can be many.',
      // demandOption: true,
      default: './secret/**',
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
      console.log(`using encKey from process.env.${c.dim(encKeyVar)}`)
    } else {
      throw new Error(
        `encKey is required. Can be provided as --encKey or env.SECRET_ENCRYPTION_KEY (see readme.md)`,
      )
    }
  }

  // `as any` because @types/yargs can't handle string[] type properly
  return { pattern: pattern as any, encKey, algorithm, del }
}

/**
 * Encrypts all files in given directory (except *.enc), saves encrypted versions as filename.ext.enc.
 * Using provided encKey.
 */
export async function secretsEncrypt(
  pattern: string[],
  encKey: string,
  algorithm?: string,
  del?: boolean,
): Promise<void> {
  const patterns = [
    ...pattern,
    `!**/*.enc`, // excluding already encoded
  ]
  const filenames = await globby(patterns)

  await pMap(filenames, async filename => {
    const plain = await fs.readFile(filename)
    const enc = await encryptRandomIVBuffer(plain, encKey, algorithm)

    const encFilename = `${filename}.enc`
    await fs.writeFile(encFilename, enc)

    if (del) {
      await fs.unlink(filename)
    }

    console.log(`  ${path.basename(filename)} > ${path.basename(encFilename)}`)
  })

  console.log(
    `encrypted ${c.bold.white(String(filenames.length))} files in (${c.dim(pattern.join(' '))})`,
  )
}
