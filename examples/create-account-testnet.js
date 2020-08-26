const { Keypair } = require('../');
const { createTestnetAccount } = require('./utils');

(async () => {
  const keypair = await Keypair.randomLocalPartyThreshSig();
  await createTestnetAccount(keypair.publicKey());
})();
