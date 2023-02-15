const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic =
  "dawn rent you scissors south abuse once violin unveil birth slice noise";

module.exports = {
  networks: {
    ethereum_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://goerli.infura.io/v3/0e88431708fb4d219a28755bf50fb061`
        ),
      network_id: 5, // Goerli's id
      chain_id: 5,
      skipDryRun: true,
      networkCheckTimeout: 60000,
    },
    bsc_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://data-seed-prebsc-1-s3.binance.org:8545`
        ),
      skipDryRun: true,
      network_id: 97, // Binance Snart Chain testnet's id
      chain_id: 97,
      networkCheckTimeout: 100000,
    },
    polygon_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://polygon-mumbai.infura.io/v3/0e88431708fb4d219a28755bf50fb061`
        ),
      skipDryRun: true,
      network_id: 80001, // Binance Snart Chain testnet's id
      chain_id: 80001,
      networkCheckTimeout: 100000,
    },
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.0", // Fetch exact version from solc-bin
    },
  },
};
