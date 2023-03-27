import { PublicJudge } from 'models/public/years/judges';

const PublicJudgeCardWidgetComponent = (props: {
  submissionId: string;
  publicJudge: PublicJudge;
}) => {
  const {
    judges /* , totalPoints, createdAt, updatedAt, approved, approvedAt */,
  } = props.publicJudge;

  const judge = judges.find(
    (judge) => judge.submissionId === props.submissionId
  );

  return judge ? (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="card-content flex flex-col justify-start">
          <div className="flex flex-row flex-wrap justify-start">
            <div className="mr-3">Point: {judge.point}</div>
            <div>User ID: {judge.userId}</div>
          </div>
          <div className="flex flex-row justify-start">
            <div>Message: {judge.message}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default PublicJudgeCardWidgetComponent;
