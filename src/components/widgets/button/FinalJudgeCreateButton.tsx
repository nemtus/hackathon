import { useNavigate } from 'react-router-dom';

const FinalJudgeCreateButton = (props: {
  userId: string;
  yearId: string;
  disabled: boolean;
}) => {
  const navigate = useNavigate();

  const handleFinalJudgeCreate = async () => {
    const userId = props.userId;
    const yearId = props.yearId;
    navigate(`/private/users/${userId}/years/${yearId}/final-judges/create`);
  };

  return (
    <button
      className="btn btn-accent border-hidden outline-0 w-64 m-2"
      onClick={handleFinalJudgeCreate}
      disabled={props.disabled}
    >
      Create Final Judge
    </button>
  );
};

export default FinalJudgeCreateButton;
