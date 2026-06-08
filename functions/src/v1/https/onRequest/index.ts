import { HttpsFunction } from 'firebase-functions/v1';
import { exportFunction } from '../../../utils/firebase/deploy';
import { hello } from './hello';

const _exportFunction = (name: string, f: () => HttpsFunction) =>
  exportFunction(['v1', 'https', 'onRequest', name], exports, f);

_exportFunction('hello', hello);
