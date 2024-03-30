import { PublicFinalVote } from 'models/public/years/final-votes';

const PublicFinalVoteForAwardCardWidgetComponent = (props: {
  submissionId: string;
  publicFinalVote: PublicFinalVote;
}) => {
  const {
    votes /* , totalPoints, createdAt, updatedAt, approved, approvedAt */,
  } = props.publicFinalVote;

  const vote = votes.find((vote) => vote.submissionId === props.submissionId);

  return vote ? (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="card-content flex flex-col justify-start max-w-xs">
          <div className="flex flex-row flex-wrap justify-start">
            <div className="mr-3 max-w-xs">Point: {vote.point}</div>
            <div className="mr-3 max-w-xs break-all">
              User ID: {vote.userId}
            </div>
          </div>
          <div className="flex flex-row justify-start max-w-xs break-words">
            <div>Message: {vote.message}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default PublicFinalVoteForAwardCardWidgetComponent;
