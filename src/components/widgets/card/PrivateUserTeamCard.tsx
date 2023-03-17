import CopyButtonComponent from 'components/widgets/button/CopyButton';
import { PrivateUserYearTeam } from 'models/private/users/years/teams';

const PrivateUserTeamCardWidgetComponent = (
  privateUserTeam: PrivateUserYearTeam
) => {
  const {
    id,
    yearId,
    name,
    // users,
    teamAddress,
    addressForPrizeReceipt,
    // createdAt,
    // updatedAt,
    // approved,
    // approvedAt,
  } = privateUserTeam;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">Team Information</h2>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">Team Name</div>
              <div className="stat-value">{name}</div>
            </div>
          </div>
        </div>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">Year</div>
              <div className="stat-value">{yearId}</div>
            </div>
          </div>
        </div>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">
                Team ID
                <CopyButtonComponent copiedString={id} />
              </div>
              <div className="stat-value">{id}</div>
            </div>
          </div>
        </div>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">
                Team Address
                <CopyButtonComponent copiedString={teamAddress} />
              </div>
              <div className="stat-value">
                <a
                  className="link link-primary"
                  href={`${process.env.REACT_APP_SYMBOL_BLOCK_EXPLORER_URL}/accounts/${teamAddress}`}
                >
                  {teamAddress}
                </a>
              </div>
              <div className="stat-desc">Team Multisig Account Address</div>
            </div>
          </div>
        </div>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">
                Address for Prize Receipt
                <CopyButtonComponent copiedString={addressForPrizeReceipt} />
              </div>
              <div className="stat-value">
                <a
                  className="link link-primary"
                  href={`${process.env.REACT_APP_SYMBOL_BLOCK_EXPLORER_URL}/accounts/${addressForPrizeReceipt}`}
                >
                  {addressForPrizeReceipt}
                </a>
              </div>
              <div className="stat-desc">
                The address of the account managed by the team member
                himself/herself
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserTeamCardWidgetComponent;
