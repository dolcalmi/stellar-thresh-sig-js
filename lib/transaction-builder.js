import { TransactionBuilder as StellarTransactionBuilder } from 'stellar-sdk';
import Transaction from './transaction';

export default class TransactionBuilder extends StellarTransactionBuilder {
  /**
   * This will build the transaction.
   * It will also increment the source account's sequence number by 1.
   * @returns {Transaction} This method will return the built {@link Transaction}.
   */
  build() {
    const tx = super.build();
    return new Transaction(tx.toEnvelope(), this.networkPassphrase);
  }
}
