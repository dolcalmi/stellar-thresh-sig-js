import { Transaction as StellarTransaction } from 'stellar-sdk';

export default class Transaction extends StellarTransaction {
  /**
  * Signs the transaction with the given {@link Keypair}.
  * @param {...Keypair} keypairs Keypairs of signers
  * @returns {void}
  */
  async sign(...keypairs) {
    const txHash = this.hash();
    keypairs.forEach(async (kp) => {
      const sig = await kp.signDecorated(txHash);
      this.signatures.push(sig);
    });
  }
}
