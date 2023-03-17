import { PublicUser } from 'models/public/users';
import CopyButtonComponent from '../button/CopyButton';

const PrivateUserTeamMembersTableWidgetComponent = (props: {
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
          <tr key={publicUser.id}>
            <td>{publicUser.displayName}</td>
            <td>
              <CopyButtonComponent copiedString={publicUser.twitterId} />
              <a className="link link-primary" href={publicUser.twitterId}>
                {publicUser.twitterId}
              </a>
              <CopyButtonComponent copiedString={publicUser.twitterId} />
            </td>
            <td>
              <CopyButtonComponent copiedString={publicUser.githubId} />
              <a className="link link-primary" href={publicUser.githubId}>
                {publicUser.githubId}
              </a>
              <CopyButtonComponent copiedString={publicUser.githubId} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PrivateUserTeamMembersTableWidgetComponent;
