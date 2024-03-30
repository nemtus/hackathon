import { useNavigate } from 'react-router-dom';

const FinalVoteCreateButton = (props: {
  userId: string;
  yearId: string;
  disabled: boolean;
}) => {
  const navigate = useNavigate();

  const handleFinalVote = async () => {
    const userId = props.userId;
    const yearId = props.yearId;
    navigate(`/private/users/${userId}/years/${yearId}/final-votes/create`);
  };

  return (
    <button
      className="btn btn-accent border-hidden outline-0 w-64 m-2"
      onClick={handleFinalVote}
      disabled={props.disabled}
    >
      Create Final Vote
    </button>
  );
};

export default FinalVoteCreateButton;
