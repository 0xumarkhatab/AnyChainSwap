const Web3 = require("web3");
const BridgeEth = require("../build/contracts/BridgeEth.json");
const BridgeBsc = require("../build/contracts/BridgeBsc.json");

// Instantiating web3 objects with chains

const web3Eth = new Web3(
  "wss://goerli.infura.io/ws/v3/0e88431708fb4d219a28755bf50fb061"
);
const web3Polygon = new Web3(
  "https://polygon-mumbai.infura.io/v3/0e88431708fb4d219a28755bf50fb061"
);
const web3Bsc = new Web3("https://data-seed-prebsc-1-s3.binance.org:8545");
const web3Optimism = new Web3(
  "https://optimism-goerli.infura.io/v3/0e88431708fb4d219a28755bf50fb061"
);
const web3Arbitrum = new Web3(
  "https://arbitrum-goerli.infura.io/v3/0e88431708fb4d219a28755bf50fb061"
);
const web3Avalanche = new Web3(
  "https://avalanche-fuji.infura.io/v3/0e88431708fb4d219a28755bf50fb061"
);

// The private key of the wallet to be used as the admin address
const adminPrivKey =
  "20f59edb6af6f23b164d83f03175455b72a9d9fc514006a48cbea92c49101a8d";

// Deriving the public address of the wallet using the private key
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

async function performDestinationSwap(
  user,
  amount,
  nonce,
  signature,
  sourceChain,
  destinationChain
) {
  switch (destinationChain) {
    case "ethereum":
      console.log("Withdrawing on Ethereum Bridge...");

      break;
    case "bsc":
      console.log("Withdrawing on Bsc Bridge...");

      break;
    case "polygon":
      console.log("Withdrawing on Polygon Bridge...");

      break;
    case "arbitrum":
      console.log("Withdrawing on Arbitrum Bridge...");

      break;
    case "optimism":
      console.log("Withdrawing on Optimism Bridge...");

      break;
    case "avalanche":
      console.log("Withdrawing on Avalanche Bridge...");

      break;

    default:
      console.log("Invalid Chain");
  }
}

// Instantiating the BridgeEth contract with its ABI and address
const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks["5"].address
);

// Instantiating the BridgeBsc contract with its ABI and address
const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks["97"].address
);

// Listening to Transfer events emitted by the BridgeEth contract
console.log("Listening to the events....");

//

bridgeEth.events.DepositSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature, sourceChain, destinationChain } =
    event.returnValues;
  console.log(`
    ETH Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Signature ${signature}
  `);

  // initiate withdraw transaction
  // Destructuring the values from the event
  const tx = bridgeBsc.methods.withdraw(user, amount, nonce, signature);

  // Getting the gas price and gas cost required for the method call
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({ from: admin }),
  ]);

  // Encoding the ABI of the method
  const data = tx.encodeABI();

  // Preparing the transaction data
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice,
  };

  // Sending the transaction to the Binance Smart Chain
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  // Logging the transaction hash
  console.log(`Transaction hash: ${receipt.transactionHash}`);
});

bridgeEth.events.WithdrawSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
    ETH Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
});

// BSC Events Handling

bridgeBsc.events.DepositSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
    BSC Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Signature ${signature}
  `);

  // initiate withdraw transaction
  // Destructuring the values from the event
  const tx = bridgeBsc.methods.withdraw(user, amount, nonce, signature);

  // Getting the gas price and gas cost required for the method call
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({ from: admin }),
  ]);

  // Encoding the ABI of the method
  const data = tx.encodeABI();

  // Preparing the transaction data
  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    data,
    gas: gasCost,
    gasPrice,
  };

  // Sending the transaction to the Binance Smart Chain
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  // Logging the transaction hash
  console.log(`Transaction hash: ${receipt.transactionHash}`);
});

bridgeBsc.events.WithdrawSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
    BSC Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
});
