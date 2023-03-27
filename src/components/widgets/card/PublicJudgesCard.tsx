import { PublicUserYearJudges } from 'models/public/users/years/judges';
import PublicJudgeCardWidgetComponent from 'components/widgets/card/PublicJudgeCard';

const PublicJudgesCardWidgetComponent = (props: {
  submissionId: string;
  publicUserYearJudges: PublicUserYearJudges;
}) => {
  return props.publicUserYearJudges.length ? (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="collapse collapse-arrow">
            <input type="checkbox" />
            <h2 className="card-title justify-start collapse-title">
              Judge List
            </h2>
            <div className="collapse-content">
              <div className="card-content flex flex-col justify-start">
                <div className="flex flex-row flex-wrap justify-start">
                  {props.publicUserYearJudges.map((publicUserYearJudge) => (
                    <PublicJudgeCardWidgetComponent
                      submissionId={props.submissionId}
                      publicJudge={publicUserYearJudge}
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

export default PublicJudgesCardWidgetComponent;
