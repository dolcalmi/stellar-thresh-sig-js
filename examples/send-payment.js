const StellarSdk = require("stellar-sdk");

const { Keypair, TransactionBuilder } = require('../');
const { createTestnetAccount } = require('./utils');

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

async function sendPayment() {
  const senderKeypair = await Keypair.randomTwoPartyThreshSig();
  const destination = "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR";
  const amount = "9998";

  console.log(
    `Making a new test account and sending ${amount} lumens to ${destination}`,
  );

  await createTestnetAccount(senderKeypair.publicKey());

  const [ { max_fee: { mode: fee } }, sender,] = await Promise.all([
    server.feeStats(),
    server.loadAccount(senderKeypair.publicKey()),
  ]);

  const transaction = new TransactionBuilder(sender, {
    fee,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      // This operation sends the destination account XLM
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount,
      }),
    )
    .setTimeout(30)
    .build();

  await transaction.sign(senderKeypair);

  try {
    // Submit the transaction to the Stellar network.
    const transactionResult = await server.submitTransaction(transaction);
    console.log(transactionResult);
    console.error(`Success! ${senderKeypair.publicKey()} paid ${destination} ${amount} XLM`);
  } catch (e) {
    console.error("Oh no! Something went wrong.");
    console.error(e.response.data.detail);
    console.error(e.response.data.extras.result_codes);
    console.error(e.response.data.type);
  }
}

sendPayment();
