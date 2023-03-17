import { exportFunctionsModule } from '../../../../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = ['entry', 'team', 'submission'];

domains.forEach((domain) =>
  exportFunctionsModule(
    ['v1', 'firestore', 'private', 'user', 'year', domain],
    exports
  )
);
