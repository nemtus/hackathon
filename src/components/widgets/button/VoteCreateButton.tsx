import { useNavigate } from 'react-router-dom';

const VoteCreateButton = (props: {
  userId: string;
  yearId: string;
  disabled: boolean;
}) => {
  const navigate = useNavigate();

  const handleJudgeVote = async () => {
    const userId = props.userId;
    const yearId = props.yearId;
    navigate(`/private/users/${userId}/years/${yearId}/votes/create`);
  };

  return (
    <button
      className="btn btn-accent border-hidden outline-0 w-64 m-2"
      onClick={handleJudgeVote}
      disabled={props.disabled}
    >
      Create Vote
    </button>
  );
};

export default VoteCreateButton;
