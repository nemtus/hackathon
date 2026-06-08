import { exportFunction } from '../../../../../utils/firebase/deploy';
import { CloudFunction } from 'firebase-functions/v1';
import { ObjectMetadata } from 'firebase-functions/v1/storage';
import { onFinalize } from './onFinalize';
import { onDelete } from './onDelete';
import { onArchive } from './onArchive';
import { onMetadataUpdate } from './onMetadataUpdate';

const _exportFunction = (
  name: string,
  f: () => CloudFunction<ObjectMetadata>,
) =>
  exportFunction(['v1', 'storage', 'admin', 'user', 'file', name], exports, f);

_exportFunction('onFinalize', onFinalize);
_exportFunction('onDelete', onDelete);
_exportFunction('onArchive', onArchive);
_exportFunction('onMetadataUpdate', onMetadataUpdate);
