const { Keypair } = require('../');

(async () => {
  // Normal signing/verification
  let keypair = Keypair.random();
  await signAndVerify(keypair);

  // Normal signing/verification from json
  keypair = await Keypair.fromJSON(keypair.toJSON());
  await signAndVerify(keypair);

  // Threshold signing/verification
  // keypair = await Keypair.randomLocalPartyThreshSig('http://your-server.com:8000');
  keypair = await Keypair.randomLocalPartyThreshSig();
  await signAndVerify(keypair);

  // Threshold signing/verification from json
  keypair = Keypair.fromJSON(keypair.toJSON());
  await signAndVerify(keypair);
})();

async function signAndVerify(keypair) {
  console.log('Public key: ', keypair.publicKey());
  console.log('Threshold sign: ', keypair.canThresholdSign());
  console.log('Normal sign: ', keypair.canSign());

  const data = 'data to sign';
  const signature = await keypair.sign(data);
  console.log('Signature: ' + signature.toString('hex'));

  if (keypair.verify(data, signature)) {
    console.log('Valid signature!\n');
  } else {
    console.log('Invalid signature!\n');
  }
}
