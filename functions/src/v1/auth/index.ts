import { UserRecord } from 'firebase-functions/v1/auth';
import { CloudFunction } from 'firebase-functions/v1';
import { exportFunction } from '../../utils/firebase/deploy';
import { onCreate } from '../../v1/auth/onCreate';
// import { onDelete } from '../../v1/auth/onDelete';

// Note: Register functions
const _exportFunction = (name: string, f: () => CloudFunction<UserRecord>) =>
  exportFunction(['v1', 'auth', name], exports, f);

_exportFunction('onCreate', onCreate);
// _exportFunction('onDelete', onDelete);
