import { PrivateUserTx } from '../../../models/private/users/txs';
import PrivateUserTxsTableWidgetComponent from '../table/PrivateUserTxsTable';

const PrivateUserTxsTableCardWidgetComponent = (props: {
  privateUserTxs: PrivateUserTx[];
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">Transactions</h2>
        <div className="card-content flex justify-start w-full">
          <PrivateUserTxsTableWidgetComponent {...props} />
        </div>
      </div>
    </div>
  );
};

export default PrivateUserTxsTableCardWidgetComponent;
