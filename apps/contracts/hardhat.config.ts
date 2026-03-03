import '@nomicfoundation/hardhat-toolbox-viem';
import 'hardhat-chai-matchers-viem';

import dotenv from 'dotenv';
import type { HardhatUserConfig } from 'hardhat/config';

dotenv.config();

const {
  INFURA_PROJECT_ID,
  PRIVATE_KEY,
  MNEMONIC,
  ETHERSCAN_API_KEY,
  COINMARKETCAP_API_KEY,
  CURRENCY,
  BASESCAN_API_KEY,
} = process.env;

let accounts: string[] | { mnemonic: string } | undefined;

if (MNEMONIC) {
  accounts = { mnemonic: MNEMONIC };
} else if (PRIVATE_KEY) {
  accounts = [PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`];
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.26',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      chainId: 1,
      accounts,
    },
    base: {
      chainId: 8453,
      url: `https://base-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts,
    },
    hardhat: {
      chainId: 31337,
      forking: {
        enabled: process.env.FORK ? process.env.FORK === 'true' : false,
        url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      },
    },
    anvil: {
      chainId: 31337,
      url: 'http://127.0.0.1:8545',
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY!,
      base: BASESCAN_API_KEY!,
    },
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    currency: CURRENCY,
  },
};

export default config;
