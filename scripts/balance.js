const TokenEth = artifacts.require("TokenEth.sol");
const TokenBsc = artifacts.require("TokenBsc.sol");
const TokenOptimism = artifacts.require("TokenOptimism.sol");
const TokenArbitrum = artifacts.require("TokenArbitrum.sol");
const TokenPolygon = artifacts.require("TokenPolygon.sol");
const TokenAvalanche = artifacts.require("TokenAvalanche.sol");

function getNetworkToken(chainName) {
  let chain = chainName.toLowerCase();
  switch (chain) {
    case "ethereum":
      return TokenEth;
    case "bsc":
      return TokenBsc;
    case "polygon":
      return TokenPolygon;
    case "arbitrum":
      return TokenArbitrum;
    case "avalanche":
      return TokenAvalanche;
    case "optimism":
      return TokenOptimism;
    default:
      console.log("Invalid Chain");
      return null;
  }
}

module.exports = async (done) => {
  const accounts = await web3.eth.getAccounts();

  let chain = process.argv[6];
  if (!chain) {
    console.log(
      "list the chain to get Token balance from.\n i.e   truffle exec scripts/balance.js --network ethereum_testnet ethereum"
    );
    done();
    return 0;
  }
  console.log("Selected chain is ", chain);
  let tokenContract = getNetworkToken(chain);
  if (!tokenContract) return 0;
  const deployedInstance = await tokenContract.deployed();
  console.log("Checking balance of ", accounts[0]);
  const balance = await deployedInstance.balanceOf(accounts[0]);
  console.log(balance.toString());
  done();
};
