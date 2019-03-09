import * as crypto from 'crypto'
import * as util from 'util'

const randomBytes = util.promisify(crypto.randomBytes)

export function md5 (s: string | Buffer): string {
  return crypto
    .createHash('md5')
    .update(s)
    .digest('hex')
}

export function stringToBase64 (s: string): string {
  return Buffer.from(s, 'utf8').toString('base64')
}

export function base64ToString (strBase64: string): string {
  return Buffer.from(strBase64, 'base64').toString('utf8')
}

export function bufferToBase64 (b: Buffer): string {
  return b.toString('base64')
}

export function base64ToBuffer (strBase64: string): Buffer {
  return Buffer.from(strBase64, 'base64')
}

function aes256Key (secretKeyBase64: string): string {
  // md5 to match aes-256 key length of 32 bytes
  return md5(Buffer.from(secretKeyBase64, 'base64'))
}

export async function encryptBuffer (
  input: Buffer,
  secretKeyBase64: string,
  algorithm = 'aes-256-cbc',
): Promise<Buffer> {
  const key = aes256Key(secretKeyBase64)

  // Random iv to achieve non-deterministic encryption (but deterministic decryption)
  const iv = await randomBytes(16)

  const cipher = crypto.createCipheriv(algorithm, key, iv)

  return Buffer.concat([iv, cipher.update(input), cipher.final()])
}

export function decryptBuffer (
  input: Buffer,
  secretKeyBase64: string,
  algorithm = 'aes-256-cbc',
): Buffer {
  const key = aes256Key(secretKeyBase64)

  // iv is first 16 bytes of encrypted buffer, the rest is payload
  const iv = input.slice(0, 16)
  const payload = input.slice(16)

  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  return Buffer.concat([decipher.update(payload), decipher.final()])
}

export async function generateSecretKey (sizeBytes = 256): Promise<Buffer> {
  return randomBytes(sizeBytes)
}

export async function generateSecretKeyBase64 (sizeBytes = 256): Promise<string> {
  return (await generateSecretKey(sizeBytes)).toString('base64')
}
