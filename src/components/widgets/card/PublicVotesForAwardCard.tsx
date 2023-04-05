import { PublicUserYearVotes } from 'models/public/users/years/votes';
import PublicVoteForAwardCardWidgetComponent from './PublicVoteForAwardCard';

const PublicVotesForAwardCardWidgetComponent = (props: {
  submissionId: string;
  publicUserYearVotes: PublicUserYearVotes;
}) => {
  return props.publicUserYearVotes.length ? (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="collapse collapse-arrow">
            <input type="checkbox" />
            <h2 className="card-title justify-start collapse-title">
              Vote List(Points:
              {props.publicUserYearVotes
                .map((publicUserYearVote) => {
                  return publicUserYearVote.votes.filter((vote) => {
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
                  {props.publicUserYearVotes.map((publicUserYearVote) => (
                    <PublicVoteForAwardCardWidgetComponent
                      submissionId={props.submissionId}
                      publicVote={publicUserYearVote}
                      key={publicUserYearVote.userId}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default PublicVotesForAwardCardWidgetComponent;
