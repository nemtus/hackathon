import { PrivateUser } from 'models/private/users';
import EntryButton from 'components/widgets/button/EntryButton';

const PrivateUserYearEntryFormWidgetComponent = (props: {
  privateUser: PrivateUser;
  yearId: string;
}) => {
  const userId = props.privateUser.id;
  const yearId = props.yearId;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">NEMTUS Hackathon {yearId}</h2>
        <div className="card-content flex justify-start">
          Please click the button below to join the NEMTUS Hackathon {yearId}.
        </div>
        <EntryButton userId={userId} yearId={yearId} disabled={false} />
      </div>
    </div>
  );
};

export default PrivateUserYearEntryFormWidgetComponent;
