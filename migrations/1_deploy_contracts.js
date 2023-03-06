// Tokens import
const Token1Eth = artifacts.require("./TokenEth1.sol");
const Token2Eth = artifacts.require("./TokenEth2.sol");
const Token3Eth = artifacts.require("./TokenEth3.sol");
const Token4Eth = artifacts.require("./TokenEth4.sol");
const Token5Eth = artifacts.require("./TokenEth5.sol");

const Token1Bsc = artifacts.require("TokenBsc1.sol");
const Token2Bsc = artifacts.require("TokenBsc2.sol");
const Token3Bsc = artifacts.require("TokenBsc3.sol");
const Token4Bsc = artifacts.require("TokenBsc4.sol");
const Token5Bsc = artifacts.require("TokenBsc5.sol");

const Token1Polygon = artifacts.require("TokenPolygon1.sol");
const Token2Polygon = artifacts.require("TokenPolygon2.sol");
const Token3Polygon = artifacts.require("TokenPolygon3.sol");
const Token4Polygon = artifacts.require("TokenPolygon4.sol");
const Token5Polygon = artifacts.require("TokenPolygon5.sol");

// Bridges import

const BridgeEth = artifacts.require("./BridgeEth.sol");
const BridgePolygon = artifacts.require("BridgePolygon.sol");
// const BridgeOptimism = artifacts.require("BridgeOptimism.sol");
// const BridgeArbitrum = artifacts.require("BridgeArbitrum.sol");
// const BridgeAvalanche = artifacts.require("BridgeAvalanche.sol");
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
    return token_;
  }
  async function NetworkContentDeployer(
    bridge,
    token1,
    token2,
    token3,
    token4,
    token5
  ) {
    let token1_ = await tokenDeployer(token1);
    let token2_ = await tokenDeployer(token2);
    let token3_ = await tokenDeployer(token3);
    let token4_ = await tokenDeployer(token4);
    let token5_ = await tokenDeployer(token5);

    await deployer.deploy(
      bridge,
      token1_.address,
      token2_.address,
      token3_.address,
      token4_.address,
      token5_.address
    );
    const bridge_ = await bridge.deployed();
    console.log("Minting tokens for bridge contract");
    console.log("token1");
    await token1_.mint(bridge_.address, 1000);
    console.log("token2");
    await token2_.mint(bridge_.address, 1000);
    console.log("token3");
    await token3_.mint(bridge_.address, 1000);
    console.log("token4");
    await token4_.mint(bridge_.address, 1000);
    console.log("token5");
    await token5_.mint(bridge_.address, 1000);

    console.log("Minting tokens for User ", addresses[0]);
    console.log("token1");
    await token1_.mint(addresses[0], 1000);
    console.log("token2");
    await token2_.mint(addresses[0], 1000);
    console.log("token3");
    await token3_.mint(addresses[0], 1000);
    console.log("token4");
    await token4_.mint(addresses[0], 1000);
    console.log("token5");
    await token5_.mint(addresses[0], 1000);
  }
};
