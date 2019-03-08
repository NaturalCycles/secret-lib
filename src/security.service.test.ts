import { securityService } from './security.service'
import { TEST_ENC_KEY } from './test/test.cnst'

test('md5', () => {
  const plain = 'hello!@#123'
  const md5 = securityService.md5(plain)
  expect(md5).toBe('41f871086829ceb41c02d2f99e11ddd0')
})

test('base64', () => {
  const plain = 'hello!@#123'
  const enc = securityService.stringToBase64(plain)
  expect(enc).toBe('aGVsbG8hQCMxMjM=')
  const dec = securityService.base64ToString(enc)
  expect(dec).toBe(plain)
})

test('generateSecretKeyBase64', async () => {
  const sizeBytes = 256
  const key = await securityService.generateSecretKey(sizeBytes)
  expect(key.length).toBe(sizeBytes)

  const keyBase64 = await securityService.generateSecretKeyBase64(sizeBytes)
  expect(keyBase64).not.toBeUndefined()
  expect(keyBase64.length).toBeGreaterThan(sizeBytes)
})

test('testEncKeySize', () => {
  const key = Buffer.from(TEST_ENC_KEY, 'base64')
  expect(key.length).toBe(256)
})

test('encryptBuffer, decryptBuffer', async () => {
  const plainStr = 'hello!@#123'
  const plain = Buffer.from(plainStr, 'utf8')
  const enc = await securityService.encryptBuffer(plain, TEST_ENC_KEY)
  const dec = securityService.decryptBuffer(enc, TEST_ENC_KEY)
  const decStr = dec.toString('utf8')
  expect(dec).toStrictEqual(plain)
  expect(decStr).toBe(plainStr)
})

test('encryptBuffer should not be deterministic', async () => {
  const plainStr = 'hello!@#123'
  const plain = Buffer.from(plainStr, 'utf8')
  const enc1 = await securityService.encryptBuffer(plain, TEST_ENC_KEY)
  const enc2 = await securityService.encryptBuffer(plain, TEST_ENC_KEY)
  expect(enc1).not.toStrictEqual(enc2)
})
