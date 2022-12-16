import {
  Configuration,
  ChainRoutesApi,
  NetworkRoutesApi,
} from '@nemtus/symbol-sdk-openapi-generator-typescript-axios';
import { logger } from '../firebase/logger';
import { getNetworkInfo } from '../../v1/model/configs/symbol/network';
import { queryValidNodes } from '../../v1/model/configs/symbol/nodes';

export const getLatestFinalizedBlockHeight = async (): Promise<number> => {
  const networkInfo = await getNetworkInfo();
  logger.debug({ networkInfo });
  if (!networkInfo) {
    throw Error('No network info found.');
  }
  const validNodes = await queryValidNodes();
  logger.debug({ validNodes });
  if (!validNodes.length) {
    throw Error('No valid nodes found.');
  }
  const latestFinalizedBlockHeights = [];
  for await (const node of validNodes) {
    const basePath = `https://${node.id}:3001`;
    logger.debug({ basePath });
    const networkRoutesApi = new NetworkRoutesApi(
      new Configuration({ basePath })
    );
    const chainRoutesApi = new ChainRoutesApi(new Configuration({ basePath }));
    try {
      const networkProperties = (await networkRoutesApi.getNetworkProperties())
        .data;
      if (networkProperties.network.identifier !== networkInfo.identifier) {
        throw Error('Network identifier mismatch');
      }
      if (
        networkProperties.network.epochAdjustment !==
        `${networkInfo.epochAdjustment?.toFixed()}s`
      ) {
        throw Error('Network epoch adjustment mismatch');
      }
      if (
        networkProperties.network.generationHashSeed !==
        networkInfo.generationHashSeed
      ) {
        throw Error('Network generation hash seed mismatch');
      }
      const chainInfo = (await chainRoutesApi.getChainInfo()).data;
      latestFinalizedBlockHeights.push(
        parseInt(chainInfo.latestFinalizedBlock.height)
      );
    } catch (error) {
      logger.debug({ error });
      latestFinalizedBlockHeights.push(0);
    }
  }
  logger.debug({ latestFinalizedBlockHeights });
  const latestFinalizedBlockHeight = Math.max(...latestFinalizedBlockHeights);
  logger.debug({ latestFinalizedBlockHeight });
  if (!latestFinalizedBlockHeight) {
    throw Error('No valid node found');
  }
  return latestFinalizedBlockHeight;
};
