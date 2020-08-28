describe('StellarThreshSig - Keypair', () => {
  const transactionBuilder = testUtils.getTransactionBuilderInstance();

  it('Should allow restore from json', () => {
    const keypairJSON = testUtils.getKeyPairJSON();
    const keypair = StellarThreshSig.Keypair.fromJSON(keypairJSON)
    expect(keypair).to.be.an.instanceof(StellarThreshSig.Keypair);
    expect(keypair.publicKey()).to.equal('GDUHBYEFUFFS2LW7LWVSDSB3PJ2ECDGGRSQMMMFHVOSCF5CM5SVO7VON');
    expect(keypair.canThresholdSign()).to.be.true;
    expect(keypair.canSign()).to.be.false;
  })

  it('Should allow export to json', () => {
    const keypairJSON = testUtils.getKeyPairJSON();
    const keypair = StellarThreshSig.Keypair.fromJSON(keypairJSON)

    expect(keypair.toJSON()).to.deep.equal(keypairJSON);
  })

})
