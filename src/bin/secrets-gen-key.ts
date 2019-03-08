#!/usr/bin/env node

import { secretsGenKeyCLI } from '../secrets-gen-key.util'

secretsGenKeyCLI().catch(err => {
  console.error(err)
  process.exit(1)
})
