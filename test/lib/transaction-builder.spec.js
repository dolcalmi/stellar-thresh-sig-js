const StellarSdk = require('stellar-sdk');

describe('StellarThreshSig - TransactionBuilder', () => {
  const transactionBuilder = testUtils.getTransactionBuilderInstance();

  it('Should return a wrapped Transaction after build', () => {
    const tx = transactionBuilder.build();
    expect(tx).to.be.an.instanceof(StellarThreshSig.Transaction);
    expect(tx).to.be.an.instanceof(StellarSdk.Transaction);
  })
  
})
