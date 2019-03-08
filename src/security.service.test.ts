import { securityService } from './security.service'

test('generateSecretKey', async () => {
  const sizeBytes = 256
  const key = await securityService.generateSecretKey(sizeBytes)
  expect(key).not.toBeUndefined()
  expect(key.length).toBeGreaterThan(sizeBytes)
})
