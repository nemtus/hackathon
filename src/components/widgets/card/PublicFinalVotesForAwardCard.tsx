import { PublicUserYearFinalVotes } from 'models/public/users/years/final-votes';
import PublicFinalVoteForAwardCardWidgetComponent from './PublicFinalVoteForAwardCard';

const PublicFinalVotesForAwardCardWidgetComponent = (props: {
  submissionId: string;
  publicUserYearFinalVotes: PublicUserYearFinalVotes;
}) => {
  return props.publicUserYearFinalVotes.length ? (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="collapse collapse-arrow">
            <input type="checkbox" />
            <h2 className="card-title justify-start collapse-title">
              Final Vote List(Points:
              {props.publicUserYearFinalVotes
                .map((publicUserYearFinalVote) => {
                  return publicUserYearFinalVote.votes.filter((vote) => {
                    return vote.submissionId === props.submissionId;
                  })[0];
                })
                .filter((vote) => vote)
                .map((vote) => vote.point)
                .reduce((previous, current) => previous + current)}
              )
            </h2>
            <div className="collapse-content">
              <div className="card-content flex flex-col justify-start">
                <div className="flex flex-row flex-wrap justify-start">
                  {props.publicUserYearFinalVotes.map(
                    (publicUserYearFinalVote) => (
                      <PublicFinalVoteForAwardCardWidgetComponent
                        submissionId={props.submissionId}
                        publicFinalVote={publicUserYearFinalVote}
                        key={publicUserYearFinalVote.userId}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default PublicFinalVotesForAwardCardWidgetComponent;
