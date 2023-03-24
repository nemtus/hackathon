import CopyButtonComponent from 'components/widgets/button/CopyButton';
import { PublicTeam } from 'models/public/years/teams';

const PublicTeamCardWidgetComponent = (publicTeam: PublicTeam) => {
  const {
    // id,
    yearId,
    name,
    // users,
    teamAddress,
    // addressForPrizeReceipt,
    // createdAt,
    // updatedAt,
    // approved,
    // approvedAt,
  } = publicTeam;

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
              <div className="stat-title">
                Team Address
                <CopyButtonComponent copiedString={teamAddress} />
              </div>
              <div className="stat-value">
                <a
                  className="link link-primary"
                  href={`${process.env.REACT_APP_SYMBOL_BLOCK_EXPLORER_URL}/accounts/${teamAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
              <div className="stat-title">Year</div>
              <div className="stat-value">{yearId}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTeamCardWidgetComponent;
