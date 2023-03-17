import { useNavigate } from 'react-router-dom';

const TeamCreateButton = (props: {
  userId: string;
  yearId: string;
  disabled: boolean;
}) => {
  const navigate = useNavigate();

  const handleTeamCreate = async () => {
    const userId = props.userId;
    const yearId = props.yearId;
    navigate(`/private/users/${userId}/years/${yearId}/teams/create`);
  };

  return (
    <button
      className="btn btn-accent border-hidden outline-0 w-64 m-2"
      onClick={handleTeamCreate}
      disabled={props.disabled}
    >
      Create Team
    </button>
  );
};

export default TeamCreateButton;
