import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { checkNodeStatus } from '../../../../../../utils/symbol/checkNodeStatus';
import { Node, setNode } from '../../../../../model/configs/symbol/nodes';
import { nodeCheckConverter } from '../../../../../model/configs/symbol/nodes/checks';

const path = '/v/1/configs/symbol/nodes/{nodeID}/checks/{checkID}';

export const onUpdate = () =>
  functions()
    .runWith({ memory: '8GB', timeoutSeconds: 540 })
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-config-symbol-node-check-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });
      const before = (
        await changeSnapshot.before.ref.withConverter(nodeCheckConverter).get()
      ).data();
      const after = (
        await changeSnapshot.after.ref.withConverter(nodeCheckConverter).get()
      ).data();
      logger.debug({ before, after });
      if (!after) {
        return;
      }
      if (!after.id) {
        return;
      }
      if (!after.nodeId) {
        return;
      }
      if (after.completedAt) {
        const node: Node = {
          id: after.nodeId,
          isValidHttp: after.isValidHttp,
          isValidHttps: after.isValidHttps,
          isValidWs: after.isValidWs,
          isValidWss: after.isValidWss,
          isLatestBlockHeight: after.isLatestBlockHeight,
          latestBlockHeight: after.latestBlockHeight,
        };
        logger.debug({ node });
        await setNode(node);
        return;
      }
      logger.debug('checkNodeStatus');
      await checkNodeStatus(after);
      logger.debug('checkNodeStatus done');
    });
