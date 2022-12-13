import WebSocket from 'ws';
import {
  Configuration,
  NodeRoutesApi,
  NetworkRoutesApi,
  ChainRoutesApi,
} from '@nemtus/symbol-sdk-openapi-generator-typescript-axios';
import {
  NodeCheck,
  setNodeCheck,
} from '../../v1/model/configs/symbol/nodes/checks';
import { getNetworkInfo } from '../../v1/model/configs/symbol/network';
import { getChainInfo } from '../../v1/model/configs/symbol/chain';
import { logger } from 'firebase-functions/v1';

export const checkNodeStatus = async (nodeCheck: NodeCheck): Promise<void> => {
  logger.debug({ nodeCheck });
  if (!nodeCheck.nodeId) {
    throw Error('No node id found');
  }

  const nodeStatus: NodeCheck = {
    id: nodeCheck.id,
    nodeId: nodeCheck.nodeId,
    isValidHttp: false,
    isValidHttps: false,
    isValidWs: false,
    isValidWss: false,
    isLatestBlockHeight: false,
    latestBlockHeight: undefined,
    completedAt: undefined,
  };

  const checkWsStatus = {
    wsCompleted: false,
    wssCompleted: false,
  };

  const networkInfo = await getNetworkInfo();
  logger.debug({ networkInfo });
  if (!networkInfo) {
    throw Error('No network info found');
  }
  const chainInfo = await getChainInfo();
  logger.debug({ chainInfo });
  if (!chainInfo) {
    throw Error('No chain info found');
  }

  try {
    const basePathSSL = `https://${nodeCheck.nodeId}:3001`;
    logger.debug({ basePathSSL });
    const nodeRoutesApiSSL = new NodeRoutesApi(
      new Configuration({ basePath: basePathSSL })
    );
    const networkRoutesApiSSL = new NetworkRoutesApi(
      new Configuration({ basePath: basePathSSL })
    );
    const chainRoutesApiSSL = new ChainRoutesApi(
      new Configuration({ basePath: basePathSSL })
    );

    const nodeInfoSSL = (await nodeRoutesApiSSL.getNodeInfo()).data;
    logger.debug({ nodeInfoSSL });
    const networkPropertiesSSL = (
      await networkRoutesApiSSL.getNetworkProperties()
    ).data;
    logger.debug({ networkPropertiesSSL });
    const chainInfoDTOSSL = (await chainRoutesApiSSL.getChainInfo()).data;
    logger.debug({ chainInfoDTOSSL });
    nodeStatus.latestBlockHeight = parseInt(chainInfoDTOSSL.height ?? 0);
    if (
      networkInfo?.generationHashSeed ===
        nodeInfoSSL.networkGenerationHashSeed &&
      networkInfo?.epochAdjustment?.toFixed() ===
        networkPropertiesSSL.network.epochAdjustment?.replace('s', '') &&
      parseInt(chainInfoDTOSSL.height) >= chainInfo.latestBlockHeight - 1
    ) {
      nodeStatus.isValidHttps = true;
      nodeStatus.isLatestBlockHeight = true;
    }
  } catch (error) {
    logger.debug(error);
  }

  try {
    const basePath = `http://${nodeCheck.nodeId}:3000`;
    logger.debug({ basePath });
    const nodeRoutesApi = new NodeRoutesApi(
      new Configuration({ basePath: basePath })
    );
    const networkRoutesApi = new NetworkRoutesApi(
      new Configuration({ basePath: basePath })
    );
    const chainRoutesApi = new ChainRoutesApi(
      new Configuration({ basePath: basePath })
    );

    const nodeInfo = (await nodeRoutesApi.getNodeInfo()).data;
    logger.debug({ nodeInfo });
    const networkProperties = (await networkRoutesApi.getNetworkProperties())
      .data;
    logger.debug({ networkProperties });
    const chainInfoDTO = (await chainRoutesApi.getChainInfo()).data;
    logger.debug({ chainInfoDTO });
    nodeStatus.latestBlockHeight = parseInt(chainInfoDTO.height ?? '0');
    if (
      networkInfo?.generationHashSeed === nodeInfo.networkGenerationHashSeed &&
      networkInfo?.epochAdjustment?.toFixed() ===
        networkProperties.network.epochAdjustment?.replace('s', '') &&
      parseInt(chainInfoDTO.height) >= chainInfo.latestBlockHeight - 1
    ) {
      nodeStatus.isValidHttp = true;
      nodeStatus.isLatestBlockHeight = true;
    }
  } catch (error) {
    logger.debug(error);
  }

  const webSocketUrlWs = `ws://${nodeCheck.nodeId}:3000/ws`;
  logger.debug({ webSocketUrlWs });
  const ws = new WebSocket(webSocketUrlWs);
  try {
    ws.on('open', () => {
      logger.debug('ws connected');
    });
    ws.on('close', () => {
      logger.debug('ws disconnected');
    });
    ws.on('error', (error) => {
      logger.debug(error);
      checkWsStatus.wsCompleted = true;
      ws.close();
    });
    ws.on('message', (msg: string) => {
      logger.debug(msg);
      const msgJson = JSON.parse(msg);
      if ('uid' in msgJson) {
        logger.debug({ uid: msgJson.uid });
        nodeStatus.isValidWs = true;
        ws.close();
        checkWsStatus.wsCompleted = true;
      }
    });
  } catch (error) {
    ws.close();
    logger.debug(error);
    checkWsStatus.wsCompleted = true;
  }

  const webSocketUrlWss = `wss://${nodeCheck.nodeId}:3001/ws`;
  const wss = new WebSocket(webSocketUrlWss);
  try {
    wss.on('open', () => {
      logger.debug('wss connected');
    });
    wss.on('close', () => {
      logger.debug('wss disconnected');
    });
    wss.on('error', (error) => {
      logger.debug(error);
      checkWsStatus.wssCompleted = true;
      wss.close();
    });
    wss.on('message', (msg: string) => {
      logger.debug(msg);
      const msgJson = JSON.parse(msg);
      if ('uid' in msgJson) {
        logger.debug({ uid: msgJson.uid });
        nodeStatus.isValidWss = true;
        wss.close();
        checkWsStatus.wssCompleted = true;
      }
    });
  } catch (error) {
    wss.close();
    logger.debug(error);
    checkWsStatus.wssCompleted = true;
  }

  const startTime = new Date();
  let checkTime: Date;
  let i = 0;
  while (
    checkWsStatus.wsCompleted === false ||
    checkWsStatus.wssCompleted === false
  ) {
    checkTime = new Date();
    if (checkTime.getTime() - startTime.getTime() > 60000) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    i++;
    logger.debug({
      i,
      checkTime,
      startTime,
      waitingTime: checkTime.getTime() - startTime.getTime(),
    });
  }

  nodeStatus.completedAt = new Date();
  logger.debug({ nodeStatus });
  await setNodeCheck(nodeCheck.nodeId, nodeStatus);
};
