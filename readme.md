## @naturalcycles/secret-lib

> Opinionated CLI tool and Node.js API to encrypt/decrypt secret files

[![npm](https://img.shields.io/npm/v/@naturalcycles/secret-lib/latest.svg)](https://www.npmjs.com/package/@naturalcycles/secret-lib)
[![](https://circleci.com/gh/NaturalCycles/secret-lib.svg?style=shield&circle-token=cbb20b471eb9c1d5ed975e28c2a79a45671d78ea)](https://circleci.com/gh/NaturalCycles/secret-lib)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Features

- Simple to install via npm (`npm i -g @naturalcycles/secret-lib` or `yarn global add @naturalcycles/secret-lib`)
- Scripts immediately available in global \$PATH (if installed globally)
- Opinionated, based on directory structure conventions
- Light (few dependencies)
- Exposes Node.js API (with types) so you can programmaticaly use same function that CLI provides (only if you want to)

# Encryption

Based on [Stronger Encryption and Decryption in Node.js](http://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/).

`aes-256-cbc` algorithm is used by default.

Random initialization vector (IV) is used, prepended to the encrypted file (first 16 bytes).

Encrypted file is stored in binary format (Buffer), containing concatenated (byte range in brackets):

- IV (0, 16)
- Payload (16, ...)

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

# Key

Commands `secrets-encrypt` and `secrets-decrypt` need a key to perform an operation (generate it with `secrets-gen-key` first time).

Key can be passed in one of the following ways, in order of preference:

1. `--encKey myKey` CLI argument (overrides everything else)
2. `SECRET_ENCRYPTION_KEY` environment variable.
3. `SECRET_ENCRYPTION_KEY` in `.env` file in your project folder (`cwd`).

Also, you can provide e.g `--encKeyVar SECRET_ENCRYPTION_KEY_B` - name of env variable to read key from.

# Usage

_All examples are for global installation. For local installations prepend the command with `yarn` (or `npm run`)._

### secrets-gen-key

Generate a `SECRET_ENCRYPTION_KEY` to be used for encryption/decryption of secret files.

Keep it secret, provide as env variable `SECRET_ENCRYPTION_KEY` to the following commands.

### secrets-encrypt

Encrypt all files (except already encrypted `*.enc`) in `./secret` folder (and its subfolder).
`.enc` is added to the file.

Example: `secret1.json` will become `secret1.json.enc`.

Options:

- `--dir` - directory to encrypt (default to `./secret`). Can provide many like `--dir dir1 dir2` or `--dir dir1 --dir dir2`.
- `--encKey` - provide encryption key
- `--encKeyVar` - read encryption key from env variable with this name (default `SECRET_ENCRYPTION_KEY`).
- `--algorithm` - encryption algorithm to use (default `aes-256-cbc`).
- `--del` - delete source files after successful encryption. Be careful!
- `help` - list possible options

### secrets-decrypt

Decrypt all encrypted files (`*.enc`) in `./secret` folder (and its subfolders).
`.enc` extension is removed after encryption, files are
overwritten.

Example: `secret1.json.enc` will become `secret1.json`.

Options: same as `secrets-encrypt`.

# .gitignore

Use [shared-module](https://github.com/NaturalCycles/shared-module) and `yarn update-from-shared-module`.

Otherwise, this is the right config for `.gitignore`:

```
# All secrets are ignored, except encrypted
/secret/**/*.*
!/secret/**/*.enc
```
