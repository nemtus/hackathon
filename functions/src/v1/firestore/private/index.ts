import { exportFunctionsModule } from '../../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = ['user'];

domains.forEach((domain) =>
  exportFunctionsModule(['v1', 'firestore', 'private', domain], exports)
);
