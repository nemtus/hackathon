import { PrivateUserYearVote } from 'models/private/users/years/votes';

const PrivateUserVoteCardWidgetComponent = (
  privateUserVote: PrivateUserYearVote
) => {
  const {
    // id,
    // userId,
    // yearId,
    votes,
    // totalPoints,
    // createdAt,
    // updatedAt,
    // approved,
    // approvedAt,
  } = privateUserVote;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">Vote Information</h2>
        <div className="card-content flex flex-col justify-start ml-6">
          <div className="flex flex-row justify-start">
            <div> Year: </div>
            <div>{privateUserVote.yearId}</div>
          </div>
          <div className="flex flex-wrap">
            {votes.map((judge, index) => (
              <div className="card bg-base-100 shadow-xl" key={index}>
                <div className="card-body">
                  <h3 className="card-title justify-start">
                    <a
                      className="link link-primary"
                      href={`/years/${judge.yearId}/results/${judge.submissionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Entry No. {index + 1}
                    </a>
                  </h3>
                  <div className="card-content flex flex-col justify-start">
                    <div className="flex flex-col justify-start">
                      <div>Point: {judge.point}</div>
                      <div>Message: {judge.message}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserVoteCardWidgetComponent;
