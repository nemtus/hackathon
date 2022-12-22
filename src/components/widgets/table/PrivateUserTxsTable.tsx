import { PrivateUserTx } from '../../../models/private/users/txs';
import CopyButtonComponent from '../button/CopyButton';

const PrivateUserTxsTableWidgetComponent = (props: {
  privateUserTxs: PrivateUserTx[];
}) => {
  const { privateUserTxs } = props;

  return (
    <table className="table table-compact w-full">
      <thead>
        <tr>
          <th>Description</th>
          <th>Transaction Hash</th>
          <th>Created at</th>
          <th>Updated at</th>
        </tr>
      </thead>
      <tbody>
        {privateUserTxs.map((tx) => (
          <tr key={tx.id}>
            <td>{tx.description}</td>
            <td>
              <CopyButtonComponent copiedString={tx.hash} />
              <a
                className="link link-primary"
                href={`${process.env.REACT_APP_SYMBOL_BLOCK_EXPLORER_URL}/transactions/${tx.hash}`}
              >
                {tx.hash}
              </a>
              <CopyButtonComponent copiedString={tx.hash} />
            </td>
            <td>
              {tx.createdAt?.toLocaleDateString()},
              {tx.createdAt?.toLocaleTimeString()}
            </td>
            <td>
              {tx.updatedAt?.toLocaleDateString()},
              {tx.updatedAt?.toLocaleTimeString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PrivateUserTxsTableWidgetComponent;
