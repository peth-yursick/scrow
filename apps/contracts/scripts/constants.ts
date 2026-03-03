import { Hex } from 'viem'; // Importing Hex type from viem

import baseDeployment from '../deployments/base.json';
import baseSepoliaDeployment from '../deployments/baseSepolia.json';
import localhostDeployment from '../deployments/localhost.json';
import mainnetDeployment from '../deployments/mainnet.json';
import { DeploymentInfo } from './utils/types';

const base = baseDeployment as DeploymentInfo;
const localhost = localhostDeployment as DeploymentInfo;
const mainnet = mainnetDeployment as DeploymentInfo;
const baseSepolia = baseSepoliaDeployment as DeploymentInfo;

export type NetworkData = {
  name: string;
  wrappedTokenAddress: Hex;
  networkCurrency: string;
  factory: Hex;
  zap?: DeploymentInfo['zap'];
  spoilsManager?: DeploymentInfo['spoilsManager'];
};

// Define the NETWORK_DATA object with the appropriate types
export const NETWORK_DATA: Record<number, NetworkData> = {
  1: {
    name: 'mainnet',
    wrappedTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' as Hex,
    networkCurrency: 'ETH',
    factory: mainnet.factory as Hex,
  },
  8453: {
    name: 'base',
    wrappedTokenAddress: '0x4200000000000000000000000000000000000006' as Hex,
    networkCurrency: 'ETH',
    factory: base.factory as Hex,
    zap: base.zap,
    spoilsManager: base.spoilsManager,
  },
  84532: {
    name: 'baseSepolia',
    wrappedTokenAddress: '0x4200000000000000000000000000000000000006' as Hex,
    networkCurrency: 'sETH',
    factory: baseSepolia.factory as Hex,
    zap: baseSepolia.zap,
    spoilsManager: baseSepolia.spoilsManager,
  },
  31337: {
    name: 'localhost',
    wrappedTokenAddress: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d' as Hex,
    networkCurrency: 'hhETH',
    factory: localhost.factory as Hex,
    zap: localhost.zap,
    spoilsManager: localhost.spoilsManager,
  },
};

// Functions to get network data
export const getNetworkData = (chainId: number): NetworkData =>
  NETWORK_DATA[chainId];
export const getNetworkName = (chainId: number): string =>
  getNetworkData(chainId).name;
export const getNetworkCurrency = (chainId: number): string =>
  getNetworkData(chainId).networkCurrency;
export const getWrappedTokenAddress = (chainId: number): Hex =>
  getNetworkData(chainId).wrappedTokenAddress;
export const getFactory = (chainId: number): Hex =>
  getNetworkData(chainId).factory;
export const getZapData = (chainId: number) => getNetworkData(chainId).zap;
export const getSpoilsManagerData = (chainId: number) =>
  getNetworkData(chainId).spoilsManager;
