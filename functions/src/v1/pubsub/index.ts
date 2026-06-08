import { exportFunctionsModule } from '../../utils/firebase/deploy';

const domains: string[] = ['schedule', 'topic'];

domains.forEach((domain) =>
  exportFunctionsModule(['v1', 'pubsub', domain], exports),
);
