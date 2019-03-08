## @naturalcycles/secret-lib

> Opinionated CLI tool to encrypt/decrypt secret files

[![npm](https://img.shields.io/npm/v/@naturalcycles/secret-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/secret-lib)
[![](https://circleci.com/gh/NaturalCycles/secret-lib.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/secret-lib)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Features

- Simple to install via npm (`npm i -g @naturalcycles/secret-enc-lib` or `yarn global add @naturalcycles/secret-enc-lib`)
- Scripts immediately available in global \$PATH (if installed globally)
- Opinionated, based on directory structure conventions
- Zero dependencies, light (few kilobytes size)

# Install

Globally (e.g in CI environment):

    yarn global add @naturalcycles/secret-lib

Or locally (if in Node.js project):

    yarn add -D @naturalcycles/secret-lib

# CLI commands

- `secrets-gen-key`: Generate a `SECRET_ENCRYPTION_KEY` to be used for encryption/decryption of secret files.
- `secrets-encrypt`: Encrypt all files (except already encrypted `*.enc`) in `./secret` folder. `.enc` is added to the file.
- `secrets-decrypt`: Decrypt all encrypted files (`*.enc`) in `./secret` folder. `.enc` extension is removed after encryption, files are
  overwritten.

# Usage

_All examples are for global installation. For local installations prepend the command with `yarn` (or `npm run`)._

### secrets-gen-key

Generate a `SECRET_ENCRYPTION_KEY` to be used for encryption/decryption of secret files.

Keep it secret, provide as env variable `SECRET_ENCRYPTION_KEY` to the following commands.

### secrets-encrypt

Encrypt all files (except already encrypted `*.enc`) in `./secret` folder. `.enc` is added to the file.

Example: `secret1.json` will become `secret1.json.enc`.

### secrets-decrypt

Decrypt all encrypted files (`*.enc`) in `./secret` folder. `.enc` extension is removed after encryption, files are
overwritten.

Example: `secret1.json.enc` will become `secret1.json`.
