const Web3 = require("web3");
const BridgeEth = require("../build/contracts/BridgeEth");
const BridgePolygon = require("../build/contracts/BridgePolygon");
const BridgeOptimism = require("../build/contracts/BridgeOptimism");
const BridgeArbitrum = require("../build/contracts/BridgeArbitrum");
const BridgeAvalanche = require("../build/contracts/BridgeAvalanche");
const BridgeBsc = require("../build/contracts/BridgeBsc");
const adminPrivKey =
  "5cba9caf051ee2e460bb9ce372cdb51fc6b8782d88dad729cb7baf63d99d95b2";
const admin = "0xbe68eE8a43ce119a56625d7E645AbAF74652d5E1";
// providers information
const ethProviderUrl =
  "wss://goerli.infura.io/ws/v3/0e88431708fb4d219a28755bf50fb061";
const polygonProviderUrl =
  "https://polygon-mumbai.infura.io/v3/0e88431708fb4d219a28755bf50fb061";
const bscProviderUrl = "https://data-seed-prebsc-1-s3.binance.org:8545";
const optimismProviderUrl =
  "https://optimism-goerli.infura.io/v3/0e88431708fb4d219a28755bf50fb061";
const arbitrumProviderUrl =
  "https://arbitrum-goerli.infura.io/v3/e3562069a1d44d18aa58a3ea55ccf21a";
const avalancheProviderUrl =
  "https://avalanche-fuji.infura.io/v3/0e88431708fb4d219a28755bf50fb061";

const ethChainId = "5";
const bscChainId = "97";
const polygonChainId = "80001";
const avalancheChainId = "43113";
const optimismChainId = "420";
const arbitrumChainId = "421613";

// Instantiating web3 objects with chains
const web3Eth = new Web3(ethProviderUrl);
const web3Polygon = new Web3(polygonProviderUrl);
const web3Bsc = new Web3(bscProviderUrl);
const web3Optimism = new Web3(optimismProviderUrl);
const web3Arbitrum = new Web3(arbitrumProviderUrl);
const web3Avalanche = new Web3(avalancheProviderUrl);

// Instantiating the Contracts to interact with

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks[ethChainId].address
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks[bscChainId].address
);
const bridgePolygon = new web3Polygon.eth.Contract(
  BridgePolygon.abi,
  BridgePolygon.networks[polygonChainId].address
);
const bridgeOptimism = new web3Optimism.eth.Contract(
  BridgeOptimism.abi,
  BridgeOptimism.networks[optimismChainId].address
);
const bridgeArbitrum = new web3Arbitrum.eth.Contract(
  BridgeArbitrum.abi,
  BridgeArbitrum.networks[arbitrumChainId].address
);
const bridgeAvalanche = new web3Avalanche.eth.Contract(
  BridgeAvalanche.abi,
  BridgeAvalanche.networks[avalancheChainId].address
);

// The private key of the wallet to be used as the admin address

// Deriving the public address of the wallet using the private key
web3Eth.eth.accounts.wallet.add(adminPrivKey);
web3Bsc.eth.accounts.wallet.add(adminPrivKey);
web3Polygon.eth.accounts.wallet.add(adminPrivKey);
web3Optimism.eth.accounts.wallet.add(adminPrivKey);
web3Avalanche.eth.accounts.wallet.add(adminPrivKey);
web3Arbitrum.eth.accounts.wallet.add(adminPrivKey);

async function executeTransaction(
  user,
  amount,
  nonce,
  signature,
  sourceChain,
  destinationChain,
  web3Object,
  bridgeObject
) {
  // initiate withdraw transaction
  // Destructuring the values from the event
  let isProcessed = await bridgeObject.methods
    .isTransactionProcessed(user, signature)
    .call();
  if (isProcessed) {
    console.log("Transaction has already been processed");
    return 0;
  }
  const tx = bridgeObject.methods.withdraw(
    user,
    amount,
    nonce,
    signature,
    sourceChain,
    destinationChain
  );

  // Getting the gas price and gas cost required for the method call
  const [gasPrice, gasCost] = await Promise.all([
    web3Object.eth.getGasPrice(),
    tx.estimateGas({ from: admin }),
  ]);

  // Encoding the ABI of the method
  const data = tx.encodeABI();

  // Preparing the transaction data
  const txData = {
    from: admin,
    to: bridgeObject.options.address,
    data,
    gas: gasCost,
    gasPrice,
  };

  // Sending the transaction to the Binance Smart Chain
  try {
    web3Object.eth.sendTransaction(txData).then((receipt) => {
      console.log(`Transaction hash: ${receipt.transactionHash}`);
    });
    // Logging the transaction hash
  } catch (e) {
    console.log(`Transaction Failed : ${e}`);
  }
}

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
      await executeTransaction(
        user,
        amount,
        nonce,
        signature,
        sourceChain,
        destinationChain,
        web3Eth,
        bridgeEth
      );
      break;
    case "bsc":
      console.log("Withdrawing on Bsc Bridge...");
      await executeTransaction(
        user,
        amount,
        nonce,
        signature,
        sourceChain,
        destinationChain,
        web3Bsc,
        bridgeBsc
      );

      break;
    case "polygon":
      console.log("Withdrawing on Polygon Bridge...");
      await executeTransaction(
        user,
        amount,
        nonce,
        signature,
        sourceChain,
        destinationChain,
        web3Polygon,
        bridgePolygon
      );

      break;
    case "arbitrum":
      console.log("Withdrawing on Arbitrum Bridge...");
      await executeTransaction(
        user,
        amount,
        nonce,
        signature,
        sourceChain,
        destinationChain,
        web3Arbitrum,
        bridgeArbitrum
      );

      break;
    case "optimism":
      console.log("Withdrawing on Optimism Bridge...");
      await executeTransaction(
        user,
        amount,
        nonce,
        signature,
        sourceChain,
        destinationChain,
        web3Optimism,
        bridgeOptimism
      );

      break;
    case "avalanche":
      console.log("Withdrawing on Avalanche Bridge...");
      await executeTransaction(
        user,
        amount,
        nonce,
        signature,
        sourceChain,
        destinationChain,
        web3Avalanche,
        bridgeAvalanche
      );

      break;

    default:
      console.log("Invalid Chain");
  }
}

// Listening to Transfer events emitted by the BridgeEth contract
console.log("Listening to the events....");

//

bridgeEth.events.DepositSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature, sourceChain, destinationChain } =
    event.returnValues;
  console.log(`
    ETH Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Destination chain is ${destinationChain}
    - Signature ${signature}
  `);

  await performDestinationSwap(
    user,
    amount,
    nonce,
    signature,
    sourceChain,
    destinationChain
  );
});
bridgeBsc.events.DepositSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature, sourceChain, destinationChain } =
    event.returnValues;
  console.log(`
    BSC Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Destination chain is ${destinationChain}
    - Signature ${signature}
  `);

  await performDestinationSwap(
    user,
    amount,
    nonce,
    signature,
    sourceChain,
    destinationChain
  );
});
bridgePolygon.events
  .DepositSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    const { user, amount, nonce, signature, sourceChain, destinationChain } =
      event.returnValues;
    console.log(`
    Polygon Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Destination chain is ${destinationChain}
    - Signature ${signature}
  `);

    await performDestinationSwap(
      user,
      amount,
      nonce,
      signature,
      sourceChain,
      destinationChain
    );
  });

//
bridgeArbitrum.events
  .DepositSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    console.log("arbitrum fired");
    const { user, amount, nonce, signature, sourceChain, destinationChain } =
      event.returnValues;
    console.log(`
    Arbitrum Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Destination chain is ${destinationChain}
    - Signature ${signature}
  `);

    await performDestinationSwap(
      user,
      amount,
      nonce,
      signature,
      sourceChain,
      destinationChain
    );
  });

bridgeOptimism.events
  .DepositSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    const { user, amount, nonce, signature, sourceChain, destinationChain } =
      event.returnValues;
    console.log(`
    Optimism Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Destination chain is ${destinationChain}
    - Signature ${signature}
  `);

    await performDestinationSwap(
      user,
      amount,
      nonce,
      signature,
      sourceChain,
      destinationChain
    );
  });
bridgeAvalanche.events
  .DepositSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    const { user, amount, nonce, signature, sourceChain, destinationChain } =
      event.returnValues;
    console.log(`
    Avalanche Deposit Success:
    - ${user} Depoisted ${amount} tokens
    - Destination chain is ${destinationChain}
    - Signature ${signature}
  `);

    await performDestinationSwap(
      user,
      amount,
      nonce,
      signature,
      sourceChain,
      destinationChain
    );
  });

bridgeEth.events.WithdrawSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
    ETH Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Destination chain is ${destinationChain}
    - Signature ${signature}
  `);
});
bridgeBsc.events.WithdrawSuccess({ fromBlock: 0 }).on("data", async (event) => {
  const { user, amount, nonce, signature } = event.returnValues;
  console.log(`
     BSC Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
});
bridgePolygon.events
  .WithdrawSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    const { user, amount, nonce, signature } = event.returnValues;
    console.log(`
     Polygon Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
  });
bridgeOptimism.events
  .WithdrawSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    const { user, amount, nonce, signature } = event.returnValues;
    console.log(`
    Optimism Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
  });
bridgeArbitrum.events
  .WithdrawSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    const { user, amount, nonce, signature } = event.returnValues;
    console.log(`
    Arbitrum Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
  });
bridgeAvalanche.events
  .WithdrawSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    const { user, amount, nonce, signature } = event.returnValues;
    console.log(`
     Avalanche Withdraw Success:
    - User ${user} Withdrawn ${amount} tokens
    - Signature ${signature}
  `);
  });
