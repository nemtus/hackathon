import {
  exportFunctionsModule,
  exportFunction,
} from '../../../../../utils/firebase/deploy';
import { Change, CloudFunction } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/lib/v1/providers/firestore';
import { onCreate } from './onCreate';
import { onUpdate } from './onUpdate';
// import { onDelete } from './onDelete';

// Note: Register functions
const _exportFunction = (
  name: string,
  f: () =>
    | CloudFunction<QueryDocumentSnapshot>
    | CloudFunction<Change<QueryDocumentSnapshot>>
) =>
  exportFunction(['v1', 'firestore', 'admin', 'user', 'tx', name], exports, f);

_exportFunction('onCreate', onCreate);
_exportFunction('onUpdate', onUpdate);
// _exportFunction('onDelete', onDelete);

// Note: Register sub-directories
const domains: string[] = [];

domains.forEach((domain) =>
  exportFunctionsModule(
    ['v1', 'firestore', 'admin', 'user', 'tx', domain],
    exports
  )
);
