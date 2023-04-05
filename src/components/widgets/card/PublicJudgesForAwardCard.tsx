import { PublicUserYearJudges } from 'models/public/users/years/judges';
import { PublicUser } from 'models/public/users';
import PublicJudgeForAwardCardWidgetComponent from 'components/widgets/card/PublicJudgeForAwardCard';

const PublicJudgesForAwardCardWidgetComponent = (props: {
  submissionId: string;
  publicUserYearJudges: PublicUserYearJudges;
  judgeUsers: PublicUser[];
}) => {
  return props.publicUserYearJudges.length ? (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="collapse collapse-open collapse-arrow">
            <input type="checkbox" />
            <h2 className="card-title justify-start collapse-title">
              Judge List(Points:
              {props.publicUserYearJudges
                .map((publicUserYearJudge) => {
                  return publicUserYearJudge.judges.filter((judge) => {
                    return judge.submissionId === props.submissionId;
                  })[0];
                })
                .filter((judge) => judge)
                .map((judge) => judge.point)
                .reduce((previous, current) => previous + current)}
              )
            </h2>
            <div className="collapse-content">
              <div className="card-content flex flex-col justify-start">
                <div className="flex flex-row flex-wrap justify-start">
                  {props.publicUserYearJudges.map((publicUserYearJudge) => (
                    <PublicJudgeForAwardCardWidgetComponent
                      submissionId={props.submissionId}
                      publicJudge={publicUserYearJudge}
                      judgeUsers={props.judgeUsers}
                      key={publicUserYearJudge.userId}
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

export default PublicJudgesForAwardCardWidgetComponent;
