import { exportFunctionsModule } from '../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = ['config'];

domains.forEach((domain) =>
  exportFunctionsModule(['v1', 'firestore', domain], exports)
);
