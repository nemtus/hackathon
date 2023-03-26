import { exportFunctionsModule } from '../../../../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = ['team', 'submission', 'judge', 'vote'];

domains.forEach((domain) =>
  exportFunctionsModule(
    ['v1', 'firestore', 'public', 'user', 'year', domain],
    exports
  )
);
