import { HttpsFunction, Runnable } from 'firebase-functions/v1';
import { exportFunction } from '../../../utils/firebase/deploy';
import { hello } from './hello';

const _exportFunction = (
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  f: () => HttpsFunction & Runnable<any>,
) => exportFunction(['v1', 'https', 'onCall', name], exports, f);

_exportFunction('hello', hello);
