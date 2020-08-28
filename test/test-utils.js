'use strict';

const StellarSdk = require('stellar-sdk');
const {exec} = require('child_process');

let server;
let isServerStarted = false;
var utils = module.exports = {

  startServer: async (port = 8000) => {
    if (isServerStarted)
      return;
    server = exec(`ROCKET_PORT=${port} ROCKET_LOG=debug npm run start-p1-server`);
    isServerStarted = true;
    server.stdin.on('data', (data) => {
      console.log(`stdin: ${data}`);
    });
    server.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    server.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    server.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
    });

    server.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await sleep(5000); // wait for server to launch
  },

  stopServer: async () => {
    server.kill();
    isServerStarted = false;
  },

  getKeyPairJSON: () => {
    return keyPairJSON;
  },

  getTransactionBuilderInstance: () => {
    const destination = 'GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR';
    const amount = '9998';
    const sender = StellarThreshSig.Keypair.fromJSON(keyPairJSON);
    const sourceAccount = new StellarSdk.Account(sender.publicKey(), '0');
    return new StellarThreshSig.TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount,
        }),
      )
      .setTimeout(30);
  },
};

const keyPairJSON = {
   "publicKey":"GDUHBYEFUFFS2LW7LWVSDSB3PJ2ECDGGRSQMMMFHVOSCF5CM5SVO7VON",
   "party2ShareKey":{
      "keyPair":{
         "public_key":{
            "bytes_str":"4a2de25c5b8f0573586fc635e61c408a90152349fa74a4bab558122c39d37c20"
         },
         "expended_private_key":{
            "prefix":"b74b0cc28ab8a1df908d0f0e972a4825a1409519735e3c098e97386a5241b13",
            "private_key":"8d629e9afd9c793a48fdabfee386c7a43c48ea0faf610c7a2ab4905e85f8ff3"
         }
      },
      "aggregatedPublicKey":{
         "apk":{
            "bytes_str":"e870e085a14b2d2edf5dab21c83b7a74410cc68ca0c630a7aba422f44cecaaef"
         },
         "hash":"2d1bfc72109386030be6900eb2d940aabaaaccd8fd4a115cab302248e2ed9b1"
      },
      "id":"50dcd03c-f54d-401c-84fa-1d496bf7226f",
      "threshSigServerEndpoint":"http://localhost:8000"
   }
};
