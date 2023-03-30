import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicUser } from 'models/public/users';

const PublicTeamMembersTableWidgetComponent = (props: {
  publicUsers: PublicUser[];
}) => {
  const { publicUsers } = props;

  return (
    <table className="table table-compact w-full">
      <thead>
        <tr>
          <th>Nick Name</th>
          <th>Twitter</th>
          <th>GitHub</th>
        </tr>
      </thead>
      <tbody>
        {publicUsers.map((publicUser) => (
          <tr key={publicUser.displayName}>
            <td>{publicUser.displayName}</td>
            <td>
              {publicUser.twitterId ? (
                <div
                  className="tooltip tooltip-top"
                  data-tip={publicUser.twitterId}
                >
                  <a
                    className="link link-info"
                    href={publicUser.twitterId}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon>
                  </a>
                </div>
              ) : (
                <></>
              )}
            </td>
            <td>
              {publicUser.githubId ? (
                <div
                  className="tooltip tooltip-top"
                  data-tip={publicUser.githubId}
                >
                  <a
                    className="link link-neutral"
                    href={publicUser.githubId}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
                  </a>
                </div>
              ) : (
                <></>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PublicTeamMembersTableWidgetComponent;
