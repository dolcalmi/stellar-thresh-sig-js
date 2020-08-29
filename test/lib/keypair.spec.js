describe('StellarThreshSig - Keypair', () => {
  let server;

  before(async () => {
    server = await testUtils.startServer();
  });

  after(() => {
    server.kill();
  });

  it('Should allow create a random threshold keypair', async () => {
    const keypair = await StellarThreshSig.Keypair.randomLocalPartyThreshSig();
    expect(StellarSdk.StrKey.isValidEd25519PublicKey(keypair.publicKey())).to.be.true;
    expect(keypair.canThresholdSign()).to.be.true;
    expect(keypair.canSign()).to.be.false;
  })

  it('Should allow sign a message', async () => {
    const keypair = await StellarThreshSig.Keypair.randomLocalPartyThreshSig();
    const data = 'data to sign';
    const signature = await keypair.sign(data);
    expect(keypair.verify(data, signature)).to.be.true;
  })

  it('Should allow export to json', () => {
    const keypairJSON = testUtils.getKeyPairJSON();
    const keypair = StellarThreshSig.Keypair.fromJSON(keypairJSON)
    expect(keypair.toJSON()).to.deep.equal(keypairJSON);
  })

  it('Should allow restore from json', () => {
    const keypairJSON = testUtils.getKeyPairJSON();
    const keypair = StellarThreshSig.Keypair.fromJSON(keypairJSON)
    expect(keypair).to.be.an.instanceof(StellarThreshSig.Keypair);
    expect(keypair.publicKey()).to.equal('GDUHBYEFUFFS2LW7LWVSDSB3PJ2ECDGGRSQMMMFHVOSCF5CM5SVO7VON');
    expect(keypair.canThresholdSign()).to.be.true;
    expect(keypair.canSign()).to.be.false;
  })

  it('Should allow restore json from secret', () => {
    const keypairJSON = StellarThreshSig.Keypair.random().toJSON();
    const keypair = StellarThreshSig.Keypair.fromJSON(keypairJSON)
    expect(keypair).to.be.an.instanceof(StellarThreshSig.Keypair);
    expect(keypair.canThresholdSign()).to.be.false;
    expect(keypair.canSign()).to.be.true;
  })

  it('Should allow restore json from public', () => {
    const keypairJSON = StellarThreshSig.Keypair.fromPublicKey('GDUHBYEFUFFS2LW7LWVSDSB3PJ2ECDGGRSQMMMFHVOSCF5CM5SVO7VON').toJSON();
    const keypair = StellarThreshSig.Keypair.fromJSON(keypairJSON)
    expect(keypair).to.be.an.instanceof(StellarThreshSig.Keypair);
    expect(keypair.canThresholdSign()).to.be.false;
    expect(keypair.canSign()).to.be.false;
  })

  it('Should fail with invalid json', () => {
    expect(() => StellarThreshSig.Keypair.fromJSON({})).to.throw('Invalid JSON object');
  })

  it('Should allow sign a transaction with a threshold keypair', async () => {
    const transactionBuilder = testUtils.getTransactionBuilderInstance();
    const keypair = await StellarThreshSig.Keypair.randomLocalPartyThreshSig();
    const tx = transactionBuilder.build();

    await tx.sign(keypair);

    expect(tx.signatures.length).to.equal(1);
    expect(keypair.verify(tx.hash(), tx.signatures[0].signature())).to.be.true;
  })

  it('Should allow sign a transaction with a normal keypair', async () => {
    const transactionBuilder = testUtils.getTransactionBuilderInstance();
    const keypair = await StellarThreshSig.Keypair.random();
    const tx = transactionBuilder.build();

    await tx.sign(keypair);

    expect(tx.signatures.length).to.equal(1);
    expect(keypair.verify(tx.hash(), tx.signatures[0].signature())).to.be.true;
  })

})
