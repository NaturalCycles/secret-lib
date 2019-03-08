#!/usr/bin/env node

import { secretsDecryptCLI } from '../secrets-decrypt.util'

secretsDecryptCLI().catch(err => {
  console.error(err)
  process.exit(1)
})
