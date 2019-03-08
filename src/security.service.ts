import * as crypto from 'crypto'
import * as util from 'util'

const randomBytes = util.promisify(crypto.randomBytes)

class SecurityService {
  md5 (s: string | Buffer): string {
    return crypto
      .createHash('md5')
      .update(s)
      .digest('hex')
  }

  stringToBase64 (s: string): string {
    return Buffer.from(s, 'utf8').toString('base64')
  }

  base64ToString (strBase64: string): string {
    return Buffer.from(strBase64, 'base64').toString('utf8')
  }

  bufferToBase64 (b: Buffer): string {
    return b.toString('base64')
  }

  base64ToBuffer (strBase64: string): Buffer {
    return Buffer.from(strBase64, 'base64')
  }

  private aes256Key (secretKeyBase64: string): string {
    // md5 to match aes-256 key length of 32 bytes
    return this.md5(Buffer.from(secretKeyBase64, 'base64'))
  }

  async encryptBuffer (
    input: Buffer,
    secretKeyBase64: string,
    algorithm = 'aes-256-cbc',
  ): Promise<Buffer> {
    const key = this.aes256Key(secretKeyBase64)

    // Random iv to achieve non-deterministic encryption (but deterministic decryption)
    const iv = await randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    return Buffer.concat([iv, cipher.update(input), cipher.final()])
  }

  decryptBuffer (input: Buffer, secretKeyBase64: string, algorithm = 'aes-256-cbc'): Buffer {
    const key = this.aes256Key(secretKeyBase64)

    // iv is first 16 bytes of encrypted buffer, the rest is payload
    const iv = input.slice(0, 16)
    const payload = input.slice(16)

    const decipher = crypto.createDecipheriv(algorithm, key, iv)

    return Buffer.concat([decipher.update(payload), decipher.final()])
  }

  async generateSecretKey (sizeBytes = 256): Promise<Buffer> {
    return randomBytes(sizeBytes)
  }

  async generateSecretKeyBase64 (sizeBytes = 256): Promise<string> {
    return (await this.generateSecretKey(sizeBytes)).toString('base64')
  }
}

export const securityService = new SecurityService()
