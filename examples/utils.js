const fetch = require("node-fetch");

module.exports = {
  createTestnetAccount: async (publicKey) => {
    try {
      console.log(
        "Funding a new account on the test network (takes a few seconds)…"
      );
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${publicKey}`
      );
      const data = await response.json();

      console.log(`Success! You have a funded Testnet account ${publicKey} :)`);
      return data;
    } catch (e) {
      console.error("Oh no! Something went wrong:", e);
      return null;
    }
  }
}
