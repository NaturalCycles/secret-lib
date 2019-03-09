import {
  base64ToString,
  decryptBuffer,
  encryptBuffer,
  generateSecretKey,
  generateSecretKeyBase64,
  md5,
  stringToBase64,
} from './security.util'
import { TEST_ENC_KEY } from './test/test.cnst'

test('md5', () => {
  const plain = 'hello!@#123'
  const m = md5(plain)
  expect(m).toBe('41f871086829ceb41c02d2f99e11ddd0')
})

test('base64', () => {
  const plain = 'hello!@#123'
  const enc = stringToBase64(plain)
  expect(enc).toBe('aGVsbG8hQCMxMjM=')
  const dec = base64ToString(enc)
  expect(dec).toBe(plain)
})

test('generateSecretKeyBase64', async () => {
  const sizeBytes = 256
  const key = await generateSecretKey(sizeBytes)
  expect(key.length).toBe(sizeBytes)

  const keyBase64 = await generateSecretKeyBase64(sizeBytes)
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
  const enc = await encryptBuffer(plain, TEST_ENC_KEY)
  const dec = decryptBuffer(enc, TEST_ENC_KEY)
  const decStr = dec.toString('utf8')
  expect(dec).toStrictEqual(plain)
  expect(decStr).toBe(plainStr)
})

test('encryptBuffer should not be deterministic', async () => {
  const plainStr = 'hello!@#123'
  const plain = Buffer.from(plainStr, 'utf8')
  const enc1 = await encryptBuffer(plain, TEST_ENC_KEY)
  const enc2 = await encryptBuffer(plain, TEST_ENC_KEY)
  expect(enc1).not.toStrictEqual(enc2)
})
