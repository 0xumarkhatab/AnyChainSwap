const BridgeEth = artifacts.require("./BridgeEth.sol");

const privKey =
  "20f59edb6af6f23b164d83f03175455b72a9d9fc514006a48cbea92c49101a8d";

module.exports = async (done) => {
  const nonce = 2; //Need to increment this for each new transfer
  const accounts = await web3.eth.getAccounts();
  const bridgeEth = await BridgeEth.deployed();
  const amount = 1000;
  const message = web3.utils
    .soliditySha3(
      { t: "address", v: accounts[0] },
      { t: "uint256", v: amount },
      { t: "uint256", v: nonce }
    )
    .toString("hex");
  const { signature } = web3.eth.accounts.sign(message, privKey);

  let res = await bridgeEth.swap(accounts[0], amount, nonce, signature);
  console.log({ signature, swap: bridgeEth.swap, res });

  done();
  
};
