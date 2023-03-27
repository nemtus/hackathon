import { PublicVote } from 'models/public/years/votes';

const PublicVoteCardWidgetComponent = (props: {
  submissionId: string;
  publicVote: PublicVote;
}) => {
  const {
    votes /* , totalPoints, createdAt, updatedAt, approved, approvedAt */,
  } = props.publicVote;

  const vote = votes.find((vote) => vote.submissionId === props.submissionId);

  return vote ? (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="card-content flex flex-col justify-start">
          <div className="flex flex-row flex-wrap justify-start">
            <div className="mr-3">Point: {vote.point}</div>
            <div>User ID: {vote.userId}</div>
          </div>
          <div className="flex flex-row justify-start">
            <div>Message: {vote.message}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default PublicVoteCardWidgetComponent;
