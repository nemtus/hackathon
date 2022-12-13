import { exportFunctionsModule } from '../../../../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = ['check'];

domains.forEach((domain) =>
  exportFunctionsModule(
    ['v1', 'firestore', 'config', 'symbol', 'node', domain],
    exports
  )
);
