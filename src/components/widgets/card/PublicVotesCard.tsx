import { PublicUserYearVotes } from 'models/public/users/years/votes';
import PublicVoteCardWidgetComponent from './PublicVoteCard';

const PublicVotesCardWidgetComponent = (props: {
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
              Vote List
            </h2>
            <div className="collapse-content">
              <div className="card-content flex flex-col justify-start">
                <div className="flex flex-row flex-wrap justify-start">
                  {props.publicUserYearVotes.map((publicUserYearVote) => (
                    <PublicVoteCardWidgetComponent
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

export default PublicVotesCardWidgetComponent;
