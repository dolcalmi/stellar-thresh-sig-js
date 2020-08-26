import { Party1 } from '@kzen-networks/thresh-sig';

export default class ThreshSigServer {
  constructor() {
    this.p1 = new Party1();
  }

  start() {
    this.p1.launchServer();
  }
}
