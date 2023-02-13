const { parseEther, ethers } = require("ethers");

const BridgeEth = artifacts.require("./BridgeEth.sol");
const BridgePolygon = artifacts.require("./BridgePolygon.sol");
const BridgeOptimism = artifacts.require("./BridgeOptimism.sol");
const BridgeArbitrum = artifacts.require("./BridgeArbitrum.sol");
const BridgeAvalanche = artifacts.require("./BridgeAvalanche.sol");
const BridgeBsc = artifacts.require("./BridgeBsc.sol");

const privKey =
  "5cba9caf051ee2e460bb9ce372cdb51fc6b8782d88dad729cb7baf63d99d95b2";
let accountAddress = "0xbe68eE8a43ce119a56625d7E645AbAF74652d5E1";

function getNetworkBridge(chainName) {
  let chain = chainName.toLowerCase();
  switch (chain) {
    case "ethereum":
      return BridgeEth;
    case "bsc":
      return BridgeBsc;
    case "polygon":
      return BridgePolygon;
    case "arbitrum":
      return BridgeArbitrum;
    case "avalanche":
      return BridgeAvalanche;
    case "optimism":
      return BridgeOptimism;
    default:
      console.log("Invalid Chain");
      return null;
  }
}
module.exports = async (done) => {
  let source = process.argv[6];
  let destination = process.argv[7];
  if (!source || !destination) {
    console.log(
      "list both source and destination chains for swap.\n i.e   truffle exec scripts/swap.js --network ethereum_testnet ethereum polygon"
    );
    done();
    return 0;
  }
  console.log("Source is " + source + " Destination " + destination);

  const nonce = 3; //Need to increment this for each new transfer
  let NetworkBridge = getNetworkBridge(source);
  if (!NetworkBridge) return 0;

  const bridge = await NetworkBridge.deployed();
  let amount = 10;
  const message = web3.utils
    .soliditySha3(
      { t: "address", v: accountAddress },
      { t: "uint256", v: amount },
      { t: "uint256", v: nonce }
    )
    .toString("hex");
  const { signature } = web3.eth.accounts.sign(message, privKey);
  console.log({ signature });
  console.log("starting swap for " + amount + "tokens...");

  let res = await bridge.swap(
    accountAddress,
    amount,
    nonce,
    signature,
    source,
    destination
  );
  console.log(res);
  done();
};
