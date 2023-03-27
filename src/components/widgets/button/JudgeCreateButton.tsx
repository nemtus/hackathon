import { useNavigate } from 'react-router-dom';

const JudgeCreateButton = (props: {
  userId: string;
  yearId: string;
  disabled: boolean;
}) => {
  const navigate = useNavigate();

  const handleJudgeCreate = async () => {
    const userId = props.userId;
    const yearId = props.yearId;
    navigate(`/private/users/${userId}/years/${yearId}/judges/create`);
  };

  return (
    <button
      className="btn btn-accent border-hidden outline-0 w-64 m-2"
      onClick={handleJudgeCreate}
      disabled={props.disabled}
    >
      Create Judge
    </button>
  );
};

export default JudgeCreateButton;
