import { useNavigate } from 'react-router-dom';

const SubmissionCreateButton = (props: {
  userId: string;
  yearId: string;
  disabled: boolean;
}) => {
  const navigate = useNavigate();

  const handleSubmissionCreate = async () => {
    const userId = props.userId;
    const yearId = props.yearId;
    navigate(`/private/users/${userId}/years/${yearId}/submissions/create`);
  };

  return (
    <button
      className="btn btn-accent border-hidden outline-0 w-64 m-2"
      onClick={handleSubmissionCreate}
      disabled={props.disabled}
    >
      Create Submission
    </button>
  );
};

export default SubmissionCreateButton;
