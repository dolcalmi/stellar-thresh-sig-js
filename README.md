# Stellar Two-Party Threshold Signature Library
[![Version](https://img.shields.io/npm/v/stellar-thresh-sig.svg)](https://www.npmjs.org/package/stellar-thresh-sig)
[![Build Status](https://api.travis-ci.org/dolcalmi/stellar-thresh-sig-js.svg?branch=master)](https://travis-ci.org/dolcalmi/stellar-thresh-sig-js)
[![Coverage Status](https://coveralls.io/repos/github/dolcalmi/stellar-thresh-sig-js/badge.svg?branch=master)](https://coveralls.io/github/dolcalmi/stellar-thresh-sig-js?branch=master)
[![David](https://img.shields.io/david/dolcalmi/stellar-thresh-sig-js.svg)](https://david-dm.org/dolcalmi/stellar-thresh-sig-js)
[![David](https://img.shields.io/david/dev/dolcalmi/stellar-thresh-sig-js.svg)](https://david-dm.org/dolcalmi/stellar-thresh-sig-js?type=dev)
[![Try on RunKit](https://badge.runkitcdn.com/stellar-thresh-sig-js.svg)](https://runkit.com/npm/stellar-thresh-sig)

Stellar Javascript two party threshold signature SDK

## Installation

1. If on Linux, install needed packages:
```sh
$ sudo apt-get update
$ sudo apt-get install libgmp3-dev pkg-config libssl-dev clang libclang-dev
```
2. Install [Node.js](https://nodejs.org/en/download/)<br>
(tested on Node 10)
3. Install [nightly Rust](https://github.com/rust-lang/rustup.rs#installation)<br>
(tested on rustc 1.38.0-nightly (0b680cfce 2019-07-09))

```bash
$ rustup toolchain install nightly-2019-07-10
$ rustup default nightly-2019-07-10-x86_64-unknown-linux-gnu # or value from `rustup show` command
$ rustc --version
# rustc 1.38.0-nightly (0b680cfce 2019-07-09)
```
4. Install the package:
```bash
$ npm i stellar-thresh-sig-js
```
Alternatively, clone it:
```bash
$ git clone https://github.com/dolcalmi/stellar-thresh-sig-js
$ cd stellar-thresh-sig-js
$ npm install
```
if you have problems getting a keypair please check [this issue](https://github.com/KZen-networks/thresh-sig-js/issues/18) or run the next command after npm install:
```bash
$ OPENSSL_STATIC=yes OPENSSL_LIB_DIR=<openssl path> npm explore @kzen-networks/thresh-sig -- npm run build-rust
# you can get openssl path with: openssl version -d
```

## Usage

This library extends `Keypair`, `Transaction` and `TransactionBuilder` from Stellar SDK.
You can use it in the same way that you use the Stellar SDK.

### Initialization

``` js
import { Keypair, Transaction, TransactionBuilder } from 'stellar-thresh-sig-js';
```
### Server Party1 Initialization

Before use threshold signatures with this library you must initialize [server (party 1)](https://github.com/KZen-networks/thresh-sig-js)

``` js
import { ThresholdSigServer } from 'stellar-thresh-sig-js';
new ThresholdSigServer().start();
```
from examples:
```bash
$ node ./examples/thresh-sig-server.js
```
with specific port and log mode:
```bash
# log options (off, debug, normal, critical)
$ ROCKET_PORT=8001 ROCKET_LOG=normal node ./examples/thresh-sig-server.js
```

If you want to more information about ENV variables go to [Rocket ENV variables](https://rocket.rs/v0.4/guide/configuration/#environment-variables)

### Keypair

Create a new random key pair with two-party threshold signature:

``` js
const keypair = await Keypair.randomLocalPartyThreshSig();
// or
const keypair = await Keypair.randomLocalPartyThreshSig('http://your-server.com:8000');
```

Export key pair:
``` js
const keypairJSON = keypair.toJSON();
await saveToFileOrDB(keypairJSON);
```

Restore from json:
``` js
const keypairJSON = await loadFromFileOrDB();
const keypair = Keypair.fromJSON(keypairJSON);
```

Sign data:
``` js
const signature = await keypair.sign(data);
```
Full example in [./examples/keypair.js](examples/keypair.js)
```bash
$ node ./examples/keypair.js
```


### Transaction and TransactionBuilder

Use it in the same way as StellarSdk

``` js
import { TransactionBuilder } from 'stellar-thresh-sig-js';

const transaction = new TransactionBuilder(sender, {
  fee,
  networkPassphrase: StellarSdk.Networks.TESTNET,
})
  .addOperation(...)
  .setTimeout(30)
  .build();

  // the only difference is that sign is an async function.
  await transaction.sign(senderKeypair);
```
Full example in [./examples/send-payment.js](examples/send-payment.js)
```bash
$ node ./examples/send-payment.js
```

## Development

Run all tests:

```bash
$ npm i
$ npm test
```

Run a single test suite:

```bash
$ npm run mocha -- test/lib/keypair.spec.js
```

Run a single test (case sensitive):

```bash
$ npm run mocha -- test/lib/keypair.spec.js --grep 'sign'
```
<sub><sup>Library based on [Two Party signatures JS SDK](https://github.com/KZen-networks/thresh-sig-js)</sup></sub>
