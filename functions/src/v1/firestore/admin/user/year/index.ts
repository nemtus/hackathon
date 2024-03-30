import { exportFunctionsModule } from '../../../../../utils/firebase/deploy';

// Note: Register sub-directories
const domains: string[] = [
  'entry',
  'team',
  'submission',
  'vote',
  'judge',
  'finalVote',
  'finalJudge',
];

domains.forEach((domain) =>
  exportFunctionsModule(
    ['v1', 'firestore', 'admin', 'user', 'year', domain],
    exports
  )
);
