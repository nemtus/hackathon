import { PublicUser } from 'models/public/users';
import { PublicJudge } from 'models/public/years/judges';

const PublicJudgeForAwardCardWidgetComponent = (props: {
  submissionId: string;
  publicJudge: PublicJudge;
  judgeUsers: PublicUser[];
}) => {
  const {
    judges /* , totalPoints, createdAt, updatedAt, approved, approvedAt */,
  } = props.publicJudge;

  const judge = judges.find(
    (judge) => judge.submissionId === props.submissionId
  );

  const user = props.judgeUsers.find((user) => user.id === judge?.userId);

  return judge ? (
    <div className="card card-side bg-base-100 shadow-xl">
      <div className="card-body">
        {user?.photoUrl ? (
          <a href={user.twitterId} target="_blank" rel="noopener noreferrer">
            <figure>
              <img className="w-48" src={user.photoUrl} alt="Judge's photo" />
            </figure>
          </a>
        ) : null}
        <div className="card-content flex flex-col justify-start max-w-xs">
          <div className="flex flex-row flex-wrap justify-start">
            <div className="mr-3">Name: {user?.displayName}</div>
            <div className="mr-3">Point: {judge.point}</div>
          </div>
          <div className="flex flex-row justify-start break-words">
            <div>Message: {judge.message}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default PublicJudgeForAwardCardWidgetComponent;
