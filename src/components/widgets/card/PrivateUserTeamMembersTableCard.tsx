import { PublicUser } from 'models/public/users';
import PrivateUserTeamMembersTableWidgetComponent from '../table/PrivateUserTeamMembersTable';

const PrivateUserTeamMembersTableCardWidgetComponent = (props: {
  publicUsers: PublicUser[];
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">Team Members</h2>
        <div className="card-content flex justify-start w-full">
          <PrivateUserTeamMembersTableWidgetComponent {...props} />
        </div>
      </div>
    </div>
  );
};

export default PrivateUserTeamMembersTableCardWidgetComponent;
