import { PublicUserYearFinalJudges } from 'models/public/users/years/final-judges';
import { PublicUser } from 'models/public/users';
import PublicFinalJudgeForAwardCardWidgetComponent from 'components/widgets/card/PublicFinalJudgeForAwardCard';

const PublicFinalJudgesForAwardCardWidgetComponent = (props: {
  submissionId: string;
  publicUserYearFinalJudges: PublicUserYearFinalJudges;
  judgeUsers: PublicUser[];
}) => {
  return props.publicUserYearFinalJudges.length ? (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="collapse collapse-open collapse-arrow">
            <input type="checkbox" />
            <h2 className="card-title justify-start collapse-title">
              Final Judge List(Points:
              {props.publicUserYearFinalJudges
                .map((publicUserYearFinalJudge) => {
                  return publicUserYearFinalJudge.judges.filter((judge) => {
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
                  {props.publicUserYearFinalJudges.map(
                    (publicUserYearFinalJudge) => (
                      <PublicFinalJudgeForAwardCardWidgetComponent
                        submissionId={props.submissionId}
                        publicFinalJudge={publicUserYearFinalJudge}
                        judgeUsers={props.judgeUsers}
                        key={publicUserYearFinalJudge.userId}
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

export default PublicFinalJudgesForAwardCardWidgetComponent;
