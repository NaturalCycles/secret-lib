import { securityService } from './security.service'
import { TEST_ENC_KEY } from './test/test.cnst'

test('generateSecretKey', async () => {
  const sizeBytes = 256
  const key = await securityService.generateSecretKey(sizeBytes)
  expect(key).not.toBeUndefined()
  expect(key.length).toBeGreaterThan(sizeBytes)
})

test('encryptString, decryptString', () => {
  const plain = 'hello!@#123'
  const enc = securityService.encryptString(plain, TEST_ENC_KEY)
  const dec = securityService.decryptString(enc, TEST_ENC_KEY)
  expect(dec).toBe(plain)
})

test('encryptBuffer, decryptBuffer', () => {
  const plainStr = 'hello!@#123'
  const plain = Buffer.from(plainStr, 'utf8')
  const enc = securityService.encryptBuffer(plain, TEST_ENC_KEY)
  const dec = securityService.decryptBuffer(enc, TEST_ENC_KEY)
  const decStr = dec.toString('utf8')
  expect(dec).toStrictEqual(plain)
  expect(decStr).toBe(plainStr)
})
