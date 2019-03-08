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

  private getDecipher (secretKey: string, algorithm: string): crypto.Decipher {
    const key = this.md5(secretKey)
    const iv = this.md5(secretKey + key).slice(0, 16)
    return crypto.createDecipheriv(algorithm, key, iv)
  }

  private getCipher (secretKey: string, algorithm: string): crypto.Cipher {
    const key = this.md5(secretKey)
    const iv = this.md5(secretKey + key).slice(0, 16)
    return crypto.createCipheriv(algorithm, key, iv)
  }

  decryptString (str: string, secretKey: string, algorithm = 'aes-256-cbc'): string {
    if (!secretKey) throw new Error('secretKey is missing')
    const decipher = this.getDecipher(secretKey, algorithm)
    let decrypted = decipher.update(str, 'base64', 'utf8')
    return (decrypted += decipher.final('utf8'))
  }

  encryptString (str: string, secretKey: string, algorithm = 'aes-256-cbc'): string {
    if (!secretKey) throw new Error('secretKey is missing')
    const cipher = this.getCipher(secretKey, algorithm)
    let encrypted = cipher.update(str, 'utf8', 'base64')
    return (encrypted += cipher.final('base64'))
  }

  async generateSecretKey (sizeBytes = 256): Promise<string> {
    const randomBytes = util.promisify(crypto.randomBytes)
    return (await randomBytes(sizeBytes)).toString('base64')
  }
}

export const securityService = new SecurityService()
