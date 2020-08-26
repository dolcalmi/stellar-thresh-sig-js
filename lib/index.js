// eslint-disable-next-line no-global-assign
require = require("esm")(module/*, options*/)
module.exports = {
  ThresholdSigServer : require("./thresh-sig-server.js").default,
  Keypair : require("./keypair.js").default,
}
