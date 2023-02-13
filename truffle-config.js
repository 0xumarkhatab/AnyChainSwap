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
      networkCheckTimeout: 40000,
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
    arbitrum_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://arbitrum-goerli.infura.io/v3/e3562069a1d44d18aa58a3ea55ccf21a`
        ),
      skipDryRun: true,
      network_id: 421613, // Binance Snart Chain testnet's id
      chain_id: 421613,
      networkCheckTimeout: 100000,
    },
    optimism_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://optimism-goerli.infura.io/v3/0e88431708fb4d219a28755bf50fb061`
        ),
      skipDryRun: true,
      network_id: 420, // Binance Snart Chain testnet's id
      chain_id: 420,
      networkCheckTimeout: 100000,
    },
    avalanche_testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://avalanche-fuji.infura.io/v3/0e88431708fb4d219a28755bf50fb061`
        ),
      skipDryRun: true,
      network_id: 43113, // Binance Snart Chain testnet's id
      chain_id: 43113,
      networkCheckTimeout: 100000,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13", // Fetch exact version from solc-bin
    },
  },
};
