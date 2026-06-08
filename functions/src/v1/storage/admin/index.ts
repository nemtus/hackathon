import { exportFunctionsModule } from '../../../utils/firebase/deploy';

const domains: string[] = ['user'];

domains.forEach((domain) =>
  exportFunctionsModule(['v1', 'storage', 'admin', domain], exports),
);
