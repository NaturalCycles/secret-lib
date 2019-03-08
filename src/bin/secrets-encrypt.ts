#!/usr/bin/env node

import { secretsEncryptCLI } from '../secrets-encrypt.util'

secretsEncryptCLI().catch(err => {
  console.error(err)
  process.exit(1)
})
