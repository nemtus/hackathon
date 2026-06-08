import { exportFunctionsModule } from '../../utils/firebase/deploy';

const domains: string[] = ['admin'];

domains.forEach((domain) =>
  exportFunctionsModule(['v1', 'storage', domain], exports),
);
