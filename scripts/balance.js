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
  if (!tokenNumber) return null;
  let tokens;
  switch (chain) {
    case "ethereum":
      tokens = [Token1Eth, Token2Eth, Token3Eth, Token4Eth, Token5Eth];
      return tokens[tokenNumber - 1];

    case "bsc":
      tokens = [Token1Bsc, Token2Bsc, Token3Bsc, Token4Bsc, Token5Bsc];
      return tokens[tokenNumber - 1];

    case "polygon":
      tokens = [
        Token1Polygon,
        Token2Polygon,
        Token3Polygon,
        Token4Polygon,
        Token5Polygon,
      ];
      return tokens[tokenNumber - 1];

    // case "arbitrum":
    //   return TokenArbitrum;
    // case "avalanche":
    //   return TokenAvalanche;
    // case "optimism":
    //   return TokenOptimism;
    default:
      console.log("Invalid Chain");
      return null;
  }
}

module.exports = async (done) => {
  const accounts = await web3.eth.getAccounts();

  let chain = process.argv[6];
  let tokenNumber = process.argv[7];

  if (!chain || !tokenNumber) {
    console.log(
      "list the chain and tokenNumber to get Token balance from.\n i.e   truffle exec scripts/balance.js --network ethereum_testnet ethereum 1"
    );
    done();
    return 0;
  }
  let tokenContract = getNetworkToken(chain, tokenNumber);
  if (!tokenContract) return 0;
  const deployedInstance = await tokenContract.deployed();
  console.log(
    "Checking balance of ",
    accounts[0],
    "for token ",
    deployedInstance.address
  );
  const balance = await deployedInstance.balanceOf(accounts[0]);
  console.log(balance.toString());
  done();
};
