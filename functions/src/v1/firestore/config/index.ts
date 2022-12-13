import { exportFunctionsModule } from '../../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = ['symbol'];

domains.forEach((domain) =>
  exportFunctionsModule(['v1', 'firestore', 'config', domain], exports)
);
