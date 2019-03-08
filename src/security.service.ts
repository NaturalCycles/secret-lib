import * as crypto from 'crypto'
import * as util from 'util'

class SecurityService {
  md5 (s: string): string {
    return crypto
      .createHash('md5')
      .update(s)
      .digest('hex')
  }

  base64 (s: string): string {
    return new Buffer(s).toString('base64')
  }

  encryptString (str: string, secretKey: string, algorithm = 'aes-256-cbc'): string {
    const key = this.md5(secretKey)
    const iv = this.md5(secretKey + key).slice(0, 16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    return [cipher.update(str, 'utf8', 'base64'), cipher.final('base64')].join('')
  }

  decryptString (str: string, secretKey: string, algorithm = 'aes-256-cbc'): string {
    const key = this.md5(secretKey)
    const iv = this.md5(secretKey + key).slice(0, 16)
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    return [decipher.update(str, 'base64', 'utf8'), decipher.final('utf8')].join('')
  }

  encryptBuffer (input: Buffer, secretKey: string, algorithm = 'aes-256-cbc'): Buffer {
    const key = this.md5(secretKey)
    const iv = this.md5(secretKey + key).slice(0, 16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    return Buffer.concat([cipher.update(input), cipher.final()])
  }

  decryptBuffer (input: Buffer, secretKey: string, algorithm = 'aes-256-cbc'): Buffer {
    const key = this.md5(secretKey)
    const iv = this.md5(secretKey + key).slice(0, 16)
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    return Buffer.concat([decipher.update(input), decipher.final()])
  }

  async generateSecretKey (sizeBytes = 256): Promise<string> {
    const randomBytes = util.promisify(crypto.randomBytes)
    return (await randomBytes(sizeBytes)).toString('base64')
  }
}

export const securityService = new SecurityService()
