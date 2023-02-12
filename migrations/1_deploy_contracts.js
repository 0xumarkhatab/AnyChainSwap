// Tokens import
const TokenEth = artifacts.require("TokenEth.sol");
const TokenBsc = artifacts.require("TokenBsc.sol");
const TokenOptimism = artifacts.require("TokenOptimism.sol");
const TokenArbitrum = artifacts.require("TokenArbitrum.sol");
const TokenPolygon = artifacts.require("TokenPolygon.sol");
const TokenAvalanche = artifacts.require("TokenAvalanche.sol");
// Bridges import

const BridgeEth = artifacts.require("BridgeEth.sol");
const BridgePolygon = artifacts.require("BridgePolygon.sol");
const BridgeOptimism = artifacts.require("BridgeOptimism.sol");
const BridgeArbitrum = artifacts.require("BridgeArbitrum.sol");
const BridgeAvalanche = artifacts.require("BridgeAvalanche.sol");
const BridgeBsc = artifacts.require("BridgeBsc.sol");

module.exports = async function (deployer, network, addresses) {
  switch (network) {
    case "ethereum_testnet":
      await NetworkContentDeployer(TokenEth, BridgeEth);
      break;
    case "bsc_testnet":
      await NetworkContentDeployer(TokenBsc, BridgeBsc);
      break;
    case "polygon_testnet":
      await NetworkContentDeployer(TokenPolygon, BridgePolygon);
      break;
    case "arbitrum_testnet":
      await NetworkContentDeployer(TokenArbitrum, BridgeArbitrum);
      break;
    case "optimism_testnet":
      await NetworkContentDeployer(TokenOptimism, BridgeOptimism);
      break;
    case "avalanche_testnet":
      await NetworkContentDeployer(TokenAvalanche, BridgeAvalanche);
      break;

    default:
      console.log("Invalid chain Network");
  }

  async function NetworkContentDeployer(token, bridge) {
    await deployer.deploy(token);
    const token_ = await token.deployed();
    await deployer.deploy(bridge, token_.address);
    const bridge_ = await bridge.deployed();
    console.log("Minting tokens for bridge contract");
    await token_.mint(bridge_.address, 1000);
    console.log("Minting tokens for User ", addresses[0]);
    await token_.mint(addresses[0], 1000);
  }
};
