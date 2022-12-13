import { exportFunctionsModule } from '../../../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = ['node'];

domains.forEach((domain) =>
  exportFunctionsModule(
    ['v1', 'firestore', 'config', 'symbol', domain],
    exports
  )
);
