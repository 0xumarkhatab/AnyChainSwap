const Token1Eth = artifacts.require("TokenEth1.sol");
const Token2Eth = artifacts.require("TokenEth2.sol");
const Token3Eth = artifacts.require("TokenEth3.sol");
const Token4Eth = artifacts.require("TokenEth4.sol");
const Token5Eth = artifacts.require("TokenEth5.sol");

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

const ethProviderUrl =
  "wss://goerli.infura.io/ws/v3/0e88431708fb4d219a28755bf50fb061";
const polygonProviderUrl =
  "https://polygon-mumbai.infura.io/v3/0e88431708fb4d219a28755bf50fb061";
const bscProviderUrl = "https://data-seed-prebsc-1-s3.binance.org:8545";
const optimismProviderUrl =
  "https://optimism-goerli.infura.io/v3/0e88431708fb4d219a28755bf50fb061";
const arbitrumProviderUrl =
  "https://arbitrum-goerli.infura.io/v3/0e88431708fb4d219a28755bf50fb061";
const avalancheProviderUrl =
  "https://avalanche-fuji.infura.io/v3/0e88431708fb4d219a28755bf50fb061";

const ethChainId = "5";
const bscChainId = "97";
const polygonChainId = "80001";
// const avalancheChainId = "43113";
// const optimismChainId = "420";
// const arbitrumChainId = "421613";

// const TokenOptimism = artifacts.require("TokenOptimism.sol");
// const TokenArbitrum = artifacts.require("TokenArbitrum.sol");
// const TokenAvalanche = artifacts.require("TokenAvalanche.sol");
// import bridges
const BridgeEth = require("../build/contracts/BridgeEth");
const BridgePolygon = require("../build/contracts/BridgePolygon");
// const BridgeOptimism = require("../build/contracts/BridgeOptimism");
// const BridgeArbitrum = require("../build/contracts/BridgeArbitrum");
// const BridgeAvalanche = require("../build/contracts/BridgeAvalanche");
const BridgeBsc = require("../build/contracts/BridgeBsc");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const privKey =
  "5cba9caf051ee2e460bb9ce372cdb51fc6b8782d88dad729cb7baf63d99d95b2";
let accountAddress = "0xbe68eE8a43ce119a56625d7E645AbAF74652d5E1";

function getNetworkWeb3(chainName) {
  let chain = chainName.toLowerCase();
  switch (chain) {
    case "ethereum":
      var localKeyProvider = new HDWalletProvider({
        privateKeys: [privKey],
        providerOrUrl: ethProviderUrl,
      });

      const web3Eth = new Web3(localKeyProvider);
      return web3Eth;

    case "bsc":
      var localKeyProvider = new HDWalletProvider({
        privateKeys: [privKey],
        providerOrUrl: bscProviderUrl,
      });

      const web3Bsc = new Web3(localKeyProvider);
      return web3Bsc;

    case "polygon":
      var localKeyProvider = new HDWalletProvider({
        privateKeys: [privKey],
        providerOrUrl: polygonProviderUrl,
      });

      const web3Polygon = new Web3(localKeyProvider);
      return web3Polygon;

    // case "arbitrum":
    //   var localKeyProvider = new HDWalletProvider({
    //     privateKeys: [privKey],
    //     providerOrUrl: arbitrumProviderUrl,
    //   });

    //   const web3Arbitrum = new Web3(localKeyProvider);
    //   return web3Arbitrum;

    // case "avalanche":
    //   var localKeyProvider = new HDWalletProvider({
    //     privateKeys: [privKey],
    //     providerOrUrl: avalancheProviderUrl,
    //   });

    //   const web3Avalanche = new Web3(localKeyProvider);
    //   return web3Avalanche;

    // case "optimism":
    //   var localKeyProvider = new HDWalletProvider({
    //     privateKeys: [privKey],
    //     providerOrUrl: optimismProviderUrl,
    //   });

    //   const web3Optimism = new Web3(localKeyProvider);
    //   return web3Optimism;

    default:
      console.log("Invalid Chain");
      return null;
  }
}

function getNetworkBridgeAddress(chainName) {
  let chain = chainName.toLowerCase();
  var web3Object = getNetworkWeb3(chain);
  if (!web3Object) return null;

  switch (chain) {
    case "ethereum":
      return BridgeEth.networks[ethChainId].address;
    case "bsc":
      return BridgeBsc.networks[bscChainId].address;
    case "polygon":
      return BridgePolygon.networks[polygonChainId].address;
    // case "arbitrum":
    //   return BridgeArbitrum.networks[arbitrumChainId].address;
    // case "avalanche":
    //   return BridgeAvalanche.networks[avalancheChainId].address;
    // case "optimism":
    //   return BridgeOptimism.networks[optimismChainId].address;
    default:
      console.log("Invalid Chain");
      return null;
  }
}

function getTokenContractByNumber(
  web3Object,
  tokenNumber,
  tokensArray,
  chainId
) {
  if (tokenNumber <= 0) return null;
  var tokenContract = new web3Object.eth.Contract(
    tokensArray[tokenNumber - 1].abi,
    tokensArray[tokenNumber - 1].networks[chainId].address
  );
  return tokenContract;
}

function getNetworkToken(chainName, tokenNumber) {
  let chain = chainName.toLowerCase();
  var web3Object = getNetworkWeb3(chain);
  if (!web3Object) return null;

  switch (chain) {
    case "ethereum":
      var tokenContract = getTokenContractByNumber(
        web3Object,
        tokenNumber,
        [Token1Eth, Token2Eth, Token3Eth, Token4Eth, Token5Eth],
        ethChainId
      );

      return tokenContract;

    case "bsc":
      var tokenContract = getTokenContractByNumber(
        web3Object,
        tokenNumber,
        [Token1Bsc, Token2Bsc, Token3Bsc, Token4Bsc, Token5Bsc],
        bscChainId
      );

      return tokenContract;

    case "polygon":
      var tokenContract = getTokenContractByNumber(
        web3Object,
        tokenNumber,
        [
          Token1Polygon,
          Token2Polygon,
          Token3Polygon,
          Token4Polygon,
          Token5Polygon,
        ],
        polygonChainId
      );

      return tokenContract;

    // case "arbitrum":
    //   var tokenContract = new web3Object.eth.Contract(
    //     TokenArbitrum.abi,
    //     TokenArbitrum.networks[arbitrumChainId].address
    //   );
    //   return tokenContract;

    // case "avalanche":
    //   var tokenContract = new web3Object.eth.Contract(
    //     TokenAvalanche.abi,
    //     TokenAvalanche.networks[avalancheChainId].address
    //   );
    //   return tokenContract;

    // case "optimism":
    //   var tokenContract = new web3Object.eth.Contract(
    //     TokenOptimism.abi,
    //     TokenOptimism.networks[optimismChainId].address
    //   );
    //   return tokenContract;

    default:
      console.log("Invalid Chain");
      return null;
  }
}

module.exports = async (done) => {
  const ethers = require("ethers");
  const nonce = 2; //Need to increment this for each new transfer
  const amount = 10; // allowing for 10 tokens
  let source = process.argv[6];
  let tokenNumber = process.argv[7];

  let tokenContract = getNetworkToken(source, tokenNumber);
  let BridgeAddress = getNetworkBridgeAddress(source);
  if (!tokenContract || !BridgeAddress) return null;
  // console.log({
  //   approve: tokenContract.methods.approve,
  //   BridgeAddress,
  //   amount,
  //   accountAddress,
  // });
  console.log("Making Approval Transaction for " + amount + " tokens...");
  await tokenContract.methods
    .approve(BridgeAddress, amount)
    .send({ from: accountAddress });

  console.log("transaction initiated !");
  let allowance = await tokenContract.methods
    .allowance(accountAddress, BridgeAddress)
    .call();

  console.log("approved", allowance, "tokens");
  done();
};
