# Crypto 🔐

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/apublicspace/crypto/blob/master/LICENSE.md)

### Crypto library for deriving mnemonics and keypairs, signing and verifying messages, and authentication

## Installation

Install @publicspace/crypto with npm:

```
npm install @publicspace/crypto
```

## Generate Mnemonic and Keypair

Import:

```
import Keys from "@publicspace/crypto";
```

Generate mnemonic:

```
const mnemonic = Keys.mnemonic();
```

Generate ed25519 keypair:

```
Keys.keypair({ type: "ed25519" });
```

Generate secp256k1 keypair:

```
Keys.keypair({ type: "secp256k1" });
```

Generate ed25519 keypair from mnemonic:

```
Keys.keypairFromMnemonic({ mnemonic, type: "ed25519" });
```

Generate secp256k1 keypair from mnemonic:

```
Keys.keypairFromMnemonic({ mnemonic, type: "secp256k1" });
```

Generate ed25519 keypair from mnemonic and passphrase:

```
Keys.keypairFromMnemonic({ mnemonic, passphrase: "passphrase123", type: "ed25519" });
```

Generate secp256k1 keypair from mnemonic and passphrase:

```
Keys.keypairFromMnemonic({ mnemonic, passphrase: "passphrase123", type: "secp256k1" });
```

## Sign and Verify Message

Import:

```
import Signature from "@publicspace/crypto";
```

Define ed25519 or secp256k1 type:

```
const type = "ed25519" || "secp256k1";
```

Optionally create keypair:

```
import Keys from "@publicspace/crypto";

const keypair = Keys.keypair({ type });
```

Create message:

```
const message = "Hello, world!";
```

Sign message:

```
const signedMessage = Signature.sign({ message, privkey: keypair.privkey, type });
```

Verify message:

```
Signature.verify({ message, pubkey: keypair.pubkey, signature: signedMessage.signature, type });
```

## Authentication

Import:

```
import Auth from "@publicspace/crypto";
```

Define token params:

```
import { keypair, sign } from "@publicspace/crypto";

const type = "ed25519" || "secp256k1";
const domain = "example.com";
const keys = keypair({ type });
const statement = Auth.prepare({ domain, pubkey: keys.pubkey });
const signature = sign({ message, privkey: keys.privkey, type });
```

Generate token that never expires:

```
const token = Auth.token({ domain, pubkey: keypair.pubkey, statement, signature });
```

Generate token that expires in 24 hours:

```
const token = Auth.token({ domain, pubkey: keypair.pubkey, statement, signature, expires: 86400000 });
```

Create certificate:

```
Auth.certificate({ token, type });
```

## Utilities

### Number to Mnemonic Word

Import:

```
import { wordFromNumber } from "@publicspace/crypto";
```

English word from number:

```
const word = wordFromNumber({ number: 42, language: "english" });
```

### Mnemonic Word to Number

Import:

```
import { numberFromWord } from "@publicspace/crypto";
```

Number from English word:

```
const number = numberFromWord({ word: "aim", language: "english" });
```

### HTTP Response Status Codes

Import:

```
import Auth, { response } from "@publicspace/crypto";
```

Usage on certificate:

```
const certificate = Auth.certificate({ token, type });

return new Response(response({ data: certificate }), {
	headers: { "Content-Type": "application/json" }
});
```
