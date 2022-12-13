import { UserRecord } from 'firebase-functions/lib/common/providers/identity';
import { CloudFunction } from 'firebase-functions';
import { exportFunction } from '../../utils/firebase/deploy';
import { onCreate } from '../../v1/auth/onCreate';
// import { onDelete } from '../../v1/auth/onDelete';

// Note: Register functions
const _exportFunction = (name: string, f: () => CloudFunction<UserRecord>) =>
  exportFunction(['v1', 'auth', name], exports, f);

_exportFunction('onCreate', onCreate);
// _exportFunction('onDelete', onDelete);
