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

const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
const BridgeEth = artifacts.require("./BridgeEth.sol");
const BridgePolygon = artifacts.require("./BridgePolygon.sol");
const BridgeBsc = artifacts.require("./BridgeBsc.sol");

// const BridgeOptimism = artifacts.require("./BridgeOptimism.sol");
// const BridgeArbitrum = artifacts.require("./BridgeArbitrum.sol");
// const BridgeAvalanche = artifacts.require("./BridgeAvalanche.sol");

const privKey =
  "5cba9caf051ee2e460bb9ce372cdb51fc6b8782d88dad729cb7baf63d99d95b2";
let accountAddress = "0xbe68eE8a43ce119a56625d7E645AbAF74652d5E1";
const ethProviderUrl =
  "wss://goerli.infura.io/ws/v3/0e88431708fb4d219a28755bf50fb061";
const polygonProviderUrl =
  "https://polygon-mumbai.infura.io/v3/0e88431708fb4d219a28755bf50fb061";
const bscProviderUrl = "https://data-seed-prebsc-1-s3.binance.org:8545";
const ethChainId = "5";
const bscChainId = "97";
const polygonChainId = "80001";

function getNetworkToken(chainName, tokenNumber) {
  let chain = chainName.toLowerCase();
  var web3Object = getNetworkWeb3(chain);
  if (!web3Object) return null;

  switch (chain) {
    case "ethereum":
      var tokenContract = getTokenContractByNumber(
        tokenNumber,
        [Token1Eth, Token2Eth, Token3Eth, Token4Eth, Token5Eth],
        web3Object,
        ethChainId
      );

      return tokenContract;

    case "bsc":
      var tokenContract = getTokenContractByNumber(
        tokenNumber,
        [Token1Bsc, Token2Bsc, Token3Bsc, Token4Bsc, Token5Bsc],
        web3Object,
        bscChainId
      );

      return tokenContract;

    case "polygon":
      var tokenContract = getTokenContractByNumber(
        tokenNumber,
        [
          Token1Polygon,
          Token2Polygon,
          Token3Polygon,
          Token4Polygon,
          Token5Polygon,
        ],
        web3Object,
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

function getNetworkWeb3(chainName) {
  let chain = chainName.toLowerCase();
  switch (chain) {
    case "ethereum":
      var localKeyProvider = new HDWalletProvider({
        privateKeys: [privKey],
        providerOrUrl: ethProviderUrl,
      });

      const web3Eth = new web3(localKeyProvider);
      return web3Eth;

    case "bsc":
      var localKeyProvider = new HDWalletProvider({
        privateKeys: [privKey],
        providerOrUrl: bscProviderUrl,
      });

      const web3Bsc = new web3(localKeyProvider);
      return web3Bsc;

    case "polygon":
      var localKeyProvider = new HDWalletProvider({
        privateKeys: [privKey],
        providerOrUrl: polygonProviderUrl,
      });

      const web3Polygon = new web3(localKeyProvider);
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

function getTokenContractByNumber(
  tokenNumber,
  tokensArray,
  web3Object,
  chainId
) {
  // console.log({
  //   web3Object,
  //   tokenNumber,
  //   tokensArray,
  //   chainId,
  // });

  if (tokenNumber <= 0) return null;
  var tokenContract = new web3Object.eth.Contract(
    tokensArray[tokenNumber - 1].abi,
    tokensArray[tokenNumber - 1].networks[chainId].address
  );
  return tokenContract;
}

function getNetworkBridge(chainName) {
  let chain = chainName.toLowerCase();
  switch (chain) {
    case "ethereum":
      return BridgeEth;
    case "bsc":
      return BridgeBsc;
    case "polygon":
      return BridgePolygon;
    default:
      console.log("Invalid Chain");
      return null;
  }
}

module.exports = async (done) => {
  let source = process.argv[6];
  let destination = process.argv[7];
  let tokenNumber = process.argv[8];

  if (!source || !destination || !tokenNumber) {
    console.log(
      "list both source and destination chains plus token number for swap.\n i.e   truffle exec scripts/swap.js --network ethereum_testnet ethereum polygon 2"
    );
    done();
    return 0;
  }
  console.log("Swapping from " + source + " to " + destination);

  const nonce = 3; //Need to increment this for each new transfer
  let NetworkBridge = getNetworkBridge(source);
  if (!NetworkBridge) return 0;

  const bridge = await NetworkBridge.deployed();
  const tokenContractAddress = getNetworkToken(source, tokenNumber);

  const amount = 10;
  const message = web3.utils
    .soliditySha3(
      { t: "address", v: accountAddress },
      { t: "uint256", v: amount },
      { t: "uint256", v: nonce }
    )
    .toString("hex");
  let Web3 = getNetworkWeb3(source);
  const { signature } = Web3.eth.accounts.sign(message, privKey);
  console.log({ signature });
  console.log("starting swap for " + amount + "tokens...");

  let res = await bridge.swap(
    accountAddress,
    tokenNumber,
    amount,
    nonce,
    signature,
    source,
    destination
  );

  /**
   *  address user,
        uint tokenNumber,
        uint amount,
        uint nonce,
        bytes memory signature,
        string memory sourceChain,
        string memory destinationChain
   */
  console.log(res);
  done();
};
