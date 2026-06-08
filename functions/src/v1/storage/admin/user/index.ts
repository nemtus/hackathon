import { exportFunctionsModule } from '../../../../utils/firebase/deploy';

const domains: string[] = ['file'];

domains.forEach((domain) =>
  exportFunctionsModule(['v1', 'storage', 'admin', 'user', domain], exports),
);
