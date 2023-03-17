import CopyButtonComponent from 'components/widgets/button/CopyButton';
import { PrivateUserYearSubmission } from 'models/private/users/years/submissions';

const PrivateUserSubmissionCardWidgetComponent = (
  privateUserSubmission: PrivateUserYearSubmission
) => {
  const {
    id,
    yearId,
    teamId,
    name,
    description,
    url,
    imageUrl,
    repositoryUrl,
    storeRepositoryUrlOnChain,
    // createdAt,
    // updatedAt,
    // approved,
    // approvedAt,
  } = privateUserSubmission;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">Submission Information</h2>
        {imageUrl ? (
          <figure>
            <img
              className="max-w-xl h-auto"
              src={imageUrl}
              alt="Submission Image"
            />
          </figure>
        ) : null}
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">Name of the work</div>
              <div className="stat-value">{name}</div>
            </div>
          </div>
        </div>
        <div className="card-content flex flex-col justify-start ml-6">
          <p>Description of the work</p>
          <p>{description}</p>
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
                URL of the work
                <CopyButtonComponent copiedString={url} />
              </div>
              <div className="stat-value">
                <a className="link link-primary" href={url}>
                  {url}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">
                URL of the repository
                <CopyButtonComponent copiedString={repositoryUrl} />
              </div>
              <div className="stat-value">
                <a className="link link-primary" href={repositoryUrl}>
                  {repositoryUrl}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">Store Repository URL On Chain?</div>
              <div className="stat-value">
                {storeRepositoryUrlOnChain ? 'Yes' : 'No'}
              </div>
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
              <div className="stat-value">{teamId}</div>
            </div>
          </div>
        </div>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">
                Submission ID
                <CopyButtonComponent copiedString={id} />
              </div>
              <div className="stat-value">{id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserSubmissionCardWidgetComponent;
