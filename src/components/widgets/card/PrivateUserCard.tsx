import { PrivateUser } from 'models/private/users';
import CopyButtonComponent from 'components/widgets/button/CopyButton';
import ProfileImageComponent from 'components/widgets/common/ProfileImage';

const PrivateUserCardWidgetComponent = (privateUser: PrivateUser) => {
  const {
    id,
    displayName,
    photoUrl,
    // twitterId,
    // githubId,
    // createdAt,
    // updatedAt,
    // initializedAt,
    // entryAt,
    // submitAt,
    // voteAt,
    multisigAddress,
  } = privateUser;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">User Information</h2>

        <figure>
          <ProfileImageComponent imageUrl={photoUrl} />
        </figure>

        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">Nick Name</div>
              <div className="stat-value">{displayName ?? 'Not set'}</div>
            </div>
          </div>
        </div>

        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">
                User ID
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
                Multisig Account Address
                <CopyButtonComponent copiedString={multisigAddress} />
              </div>
              <div className="stat-value">
                <a
                  className="link link-primary"
                  href={`${process.env.REACT_APP_SYMBOL_BLOCK_EXPLORER_URL}/accounts/${multisigAddress}`}
                >
                  {multisigAddress}
                </a>
              </div>
              <div className="stat-desc">Your Multisig Account Address</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserCardWidgetComponent;
