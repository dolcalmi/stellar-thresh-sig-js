import { Keypair as StellarKeypair, xdr } from 'stellar-sdk';
import { Ed25519Party2, Ed25519Party2Share } from '@kzen-networks/thresh-sig';
import { eddsa } from 'elliptic';

const ellipticCurve = new eddsa('ed25519');
const THRESH_SIG_SERVER_LOCAL = 'http://localhost:8000';

export default class Keypair extends StellarKeypair {

  constructor(keys) {
    let newKeys = keys;
    if (newKeys.type === 'ed25519Party2Share') {
      const pk = ellipticCurve.keyFromPublic(newKeys.party2ShareKey.getPublicKey());
      newKeys = { type: 'ed25519', publicKey: pk.getPublic() }
    }
    super(newKeys);
    if (keys.party2ShareKey){
      this._party2ShareKey = keys.party2ShareKey;
      this._threshSigServerEndpoint = keys.threshSigServerEndpoint || THRESH_SIG_SERVER_LOCAL;
    }
  }

  /**
    * Creates a random `Keypair` object with threshold signature.
    * @param {string} threshSigServerEndpoint server endpoint (ex. `http://localhost:8000`)
    * @returns {Keypair}
    */
  static async randomTwoPartyThreshSig(threshSigServerEndpoint = THRESH_SIG_SERVER_LOCAL) {
    const party2 = new Ed25519Party2(threshSigServerEndpoint);
    const party2ShareKey = await party2.generateKey();
    return new this({ type: 'ed25519Party2Share', party2ShareKey, threshSigServerEndpoint });
  }

  /**
   * Creates a new `Keypair` instance from json.
   * @param {object} keypair key pair object
   * @returns {Keypair}
   */
  static fromJSON(keypair) {
    if (keypair.secret)
      return this.fromSecret(keypair.secret);

    if (keypair.party2ShareKey){
      const party2ShareKey = Ed25519Party2Share.fromPlain([
        keypair.party2ShareKey.keyPair,
        keypair.party2ShareKey.aggregatedPublicKey,
        keypair.party2ShareKey.id,
      ]);

      return new this({
        type: 'ed25519Party2Share',
        party2ShareKey,
        threshSigServerEndpoint: keypair.party2ShareKey.threshSigServerEndpoint
      });
    }

    if (keypair.publicKey)
      return this.fromPublicKey(keypair.publicKey);

    throw new Error('Invalid JSON object');
  }

  /**
   * Returns `true` if this `Keypair` object contains threshold party 2 share key/server endpoint and can sign.
   * @returns {boolean}
   */
  canThresholdSign() {
    return !!this._party2ShareKey && !!this._threshSigServerEndpoint;
  }

  /**
   * Signs data.
   * @param {Buffer} data Data to sign
   * @returns {Buffer}
   */
  async sign(data) {
    if (this.canThresholdSign()) {
      const party2 = new Ed25519Party2(this._threshSigServerEndpoint);
      const signature = await party2.sign(Buffer.from(data), this._party2ShareKey)
      return signature.toBuffer();
    }

    return super.sign(data);
  }

  async signDecorated(data) {
    const signature = await this.sign(data);
    const hint = this.signatureHint();

    return new xdr.DecoratedSignature({ hint, signature });
  }

  /**
   * Returns a json representation of keypair.
   * @returns {object}
   */
  toJSON() {
    if (this.canThresholdSign()) {
      return {
        publicKey: this.publicKey(),
        party2ShareKey: {
          keyPair: this._party2ShareKey.getKeyPair(),
          aggregatedPublicKey: this._party2ShareKey.getAggregatedPublicKey(),
          id: this._party2ShareKey.getId(),
          threshSigServerEndpoint: this._threshSigServerEndpoint,
        },
      }
    }
    return {
      publicKey: this.publicKey(),
      secret: this.secret(),
    }
  }
}
