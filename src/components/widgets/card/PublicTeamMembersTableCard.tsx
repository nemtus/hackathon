import { PublicUser } from 'models/public/users';
import PublicTeamMembersTableWidgetComponent from '../table/PublicTeamMembersTable';

const PublicTeamMembersTableCardWidgetComponent = (props: {
  publicUsers: PublicUser[];
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">Team Members</h2>
        <div className="card-content flex justify-start w-full">
          <PublicTeamMembersTableWidgetComponent {...props} />
        </div>
      </div>
    </div>
  );
};

export default PublicTeamMembersTableCardWidgetComponent;
