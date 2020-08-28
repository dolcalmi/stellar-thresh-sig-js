const StellarSdk = require('stellar-sdk');

describe('StellarThreshSig - Transaction', () => {
  
  const transactionBuilder = testUtils.getTransactionBuilderInstance();

  before(async () => {
    await testUtils.startServer();
  });

  after(() => {
    testUtils.stopServer()
  });

  it('Should allow sign a transaction', async () => {
    const keypairJSON = testUtils.getKeyPairJSON();
    const keypair = StellarThreshSig.Keypair.fromJSON(keypairJSON)
    const tx = transactionBuilder.build();

    await tx.sign(keypair);

    expect(tx.signatures.length).to.equal(1);
    expect(keypair.verify(tx.hash(), tx.signatures[0].signature())).to.be.true;
  })

})
