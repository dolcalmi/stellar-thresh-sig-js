const { Keypair } = require('../');
const { createTestnetAccount } = require('./utils');

(async () => {
  const keypair = await Keypair.randomThreshold();
  await createTestnetAccount(keypair.publicKey());
})();
