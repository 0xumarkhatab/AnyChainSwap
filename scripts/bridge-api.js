const Web3 = require("web3");

const BridgeEth = require("../build/contracts/BridgeEth");
const BridgePolygon = require("../build/contracts/BridgePolygon");
const BridgeOptimism = require("../build/contracts/BridgeOptimism");
const BridgeArbitrum = require("../build/contracts/BridgeArbitrum");
const BridgeAvalanche = require("../build/contracts/BridgeAvalanche");
const BridgeBsc = require("../build/contracts/BridgeBsc");
const {
  ethProviderUrl,
  polygonProviderUrl,
  bscProviderUrl,
  optimismProviderUrl,
  arbitrumProviderUrl,
  avalancheProviderUrl,
  avalancheChainId,
  arbitrumChainId,
  optimismChainId,
  polygonChainId,
  bscChainId,
  ethChainId,
} = require("./providerUrls");
const adminPrivKey =
  "5cba9caf051ee2e460bb9ce372cdb51fc6b8782d88dad729cb7baf63d99d95b2";

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
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

async function executeTransaction(
  user,
  amount,
  nonce,
  signature,
  web3Object,
  bridgeObject
) {
  // initiate withdraw transaction
  // Destructuring the values from the event
  const tx = bridgeObject.methods.withdraw(user, amount, nonce, signature);

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
  const receipt = await web3Object.eth.sendTransaction(txData);
  // Logging the transaction hash
  console.log(`Transaction hash: ${receipt.transactionHash}`);
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
    ETH Deposit Success:
    - ${user} Depoisted ${amount} tokens
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
    ETH Deposit Success:
    - ${user} Depoisted ${amount} tokens
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
bridgeArbitrum.events
  .DepositSuccess({ fromBlock: 0 })
  .on("data", async (event) => {
    const { user, amount, nonce, signature, sourceChain, destinationChain } =
      event.returnValues;
    console.log(`
    ETH Deposit Success:
    - ${user} Depoisted ${amount} tokens
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
    ETH Deposit Success:
    - ${user} Depoisted ${amount} tokens
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
    ETH Deposit Success:
    - ${user} Depoisted ${amount} tokens
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
