import { logger } from '../../../utils/firebase/logger';
import functions from '../../../utils/firebase/baseFunction';
import { getLatestBlockHeight } from '../../../utils/symbol/getLatestBlockHeight';
import { getAllNodes } from '../../model/configs/symbol/nodes';
import { setChainInfo } from '../../model/configs/symbol/chain';
import {
  addNodeCheck,
  NodeCheck,
} from '../../model/configs/symbol/nodes/checks';
import { getLatestFinalizedBlockHeight } from '../../../utils/symbol/getLatestFinalizedBlockHeight';

export const checkNodes = () =>
  functions()
    .runWith({ timeoutSeconds: 540 })
    .pubsub.schedule('50 * * * *')
    .onRun(async (context) => {
      logger.debug({ context });

      const latestBlockHeight = await getLatestBlockHeight();
      logger.debug({ latestBlockHeight });
      await setChainInfo({ latestBlockHeight });

      const latestFinalizedBlockHeight = await getLatestFinalizedBlockHeight();
      logger.debug({ latestFinalizedBlockHeight });
      await setChainInfo({ latestFinalizedBlockHeight });

      const allNodes = await getAllNodes();
      logger.debug({ allNodes });
      for await (const node of allNodes) {
        const nodeCheck: NodeCheck = {
          nodeId: node.id,
        };
        await addNodeCheck(node.id, nodeCheck);
      }
    });
