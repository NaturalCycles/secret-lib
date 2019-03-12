import * as yargs from 'yargs'

export interface EncryptCLIOptions {
  dirs: string[]
  encKey: string
  algorithm?: string
  del?: boolean
}

export function getEncryptCLIOptions (): EncryptCLIOptions {
  const cwd = process.cwd()

  require('dotenv').config()

  let { dir, encKey, encKeyVar, algorithm, del } = yargs.options({
    dir: {
      type: 'array',
      desc: 'Directory with secrets. Can be many.',
      // demandOption: true,
      default: `${cwd}/secret`,
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
    encKey = process.env[encKeyVar]

    if (encKey) {
      console.log(`using encKey from env.${encKeyVar}`)
    } else {
      throw new Error(
        `encKey is required. Can be provided as --encKey or env.SECRET_ENCRYPTION_KEY (see readme.md)`,
      )
    }
  }

  // `as any` because @types/yargs can't handle string[] type properly
  return { dirs: dir as any, encKey, algorithm, del }
}
