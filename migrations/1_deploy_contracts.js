// Tokens import
const Token1Eth = artifacts.require("Token1Eth.sol");
const Token2Eth = artifacts.require("Token2Eth.sol");
const Token3Eth = artifacts.require("Token3Eth.sol");
const Token4Eth = artifacts.require("Token4Eth.sol");
const Token5Eth = artifacts.require("Token5Eth.sol");

const Token1Bsc = artifacts.require("Token1Bsc.sol");
const Token2Bsc = artifacts.require("Token2Bsc.sol");
const Token3Bsc = artifacts.require("Token3Bsc.sol");
const Token4Bsc = artifacts.require("Token4Bsc.sol");
const Token5Bsc = artifacts.require("Token5Bsc.sol");

const Token1Polygon = artifacts.require("Token1Polygon.sol");
const Token2Polygon = artifacts.require("Token2Polygon.sol");
const Token3Polygon = artifacts.require("Token3Polygon.sol");
const Token4Polygon = artifacts.require("Token4Polygon.sol");
const Token5Polygon = artifacts.require("Token5Polygon.sol");

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
      await NetworkContentDeployer(
        BridgeEth,
        Token1Eth,
        Token2Eth,
        Token3Eth,
        Token4Eth,
        Token5Eth
      );
      break;
    case "bsc_testnet":
      await NetworkContentDeployer(
        BridgeBsc,
        Token1Bsc,
        Token2Bsc,
        Token3Bsc,
        Token4Bsc,
        Token5Bsc
      );

      break;
    case "polygon_testnet":
      await NetworkContentDeployer(
        BridgePolygon,
        Token1Polygon,
        Token2Polygon,
        Token3Polygon,
        Token4Polygon,
        Token5Polygon
      );

      break;
    // case "arbitrum_testnet":
    //   await NetworkContentDeployer(TokenArbitrum, BridgeArbitrum);
    //   break;
    // case "optimism_testnet":
    //   await NetworkContentDeployer(TokenOptimism, BridgeOptimism);
    //   break;
    // case "avalanche_testnet":
    //   await NetworkContentDeployer(TokenAvalanche, BridgeAvalanche);
    //   break;

    default:
      console.log("Invalid chain Network");
  }

  async function tokenDeployer(token) {
    await deployer.deploy(token);
    const token_ = await token.deployed();
    return;
  }
  async function NetworkContentDeployer(
    bridge,
    token1,
    token2,
    token3,
    token4,
    token5
  ) {
    await deployer.deploy(bridge, token_.address);
    const bridge_ = await bridge.deployed();
    console.log("Minting tokens for bridge contract");
    await token_.mint(bridge_.address, 1000);
    console.log("Minting tokens for User ", addresses[0]);
    await token_.mint(addresses[0], 1000);
  }
};
