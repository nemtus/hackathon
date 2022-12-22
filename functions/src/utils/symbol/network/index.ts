import { NetworkType } from 'symbol-sdk';
import { getNetworkInfo } from '../../../v1/model/configs/symbol/network';

export const getNetworkType = async (): Promise<NetworkType> => {
  const networkInfo = await getNetworkInfo();
  if (!networkInfo) {
    throw Error('networkInfo is required');
  }
  const networkType =
    networkInfo.identifier === 'mainnet'
      ? NetworkType.MAIN_NET
      : NetworkType.TEST_NET;
  return networkType;
};

export const getEpochAdjustment = async (): Promise<number> => {
  const networkInfo = await getNetworkInfo();
  if (!networkInfo) {
    throw Error('networkInfo is required');
  }
  return networkInfo.epochAdjustment;
};

export const getGenerationHashSeed = async (): Promise<string> => {
  const networkInfo = await getNetworkInfo();
  if (!networkInfo) {
    throw Error('networkInfo is required');
  }
  return networkInfo.generationHashSeed;
};
