import CopyButtonComponent from 'components/widgets/button/CopyButton';
import { PublicSubmission } from 'models/public/years/submissions';

const PublicSubmissionCardWidgetComponent = (
  publicSubmission: PublicSubmission
) => {
  const {
    // id,
    yearId,
    // teamId,
    name,
    description,
    url,
    imageUrl,
    repositoryUrl,
    // storeRepositoryUrlOnChain,
    // createdAt,
    // updatedAt,
    // approved,
    // approvedAt,
  } = publicSubmission;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">Submission Information</h2>
        {imageUrl ? (
          <figure>
            <img className="w-full" src={imageUrl} alt="Submission Image" />
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
              <div className="stat-title">
                URL of the work
                <CopyButtonComponent copiedString={url} />
              </div>
              <div className="stat-value">
                <a
                  className="link link-primary"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                <a
                  className="link link-primary"
                  href={repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repositoryUrl}
                </a>
              </div>
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

export default PublicSubmissionCardWidgetComponent;
