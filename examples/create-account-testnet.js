const { Keypair } = require('../');
const { createTestnetAccount } = require('./utils');

(async () => {
  const keypair = await Keypair.randomTwoPartyThreshSig();
  await createTestnetAccount(keypair.publicKey());
})();
