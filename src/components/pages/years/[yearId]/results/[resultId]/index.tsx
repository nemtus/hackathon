import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicResult, PublicResult } from 'models/public/years/results';
import PublicSubmissionCardWidgetComponent from 'components/widgets/card/PublicSubmissionCard';
import PublicTeamCardWidgetComponent from 'components/widgets/card/PublicTeamCard';
import PublicTeamMembersTableCardWidgetComponent from 'components/widgets/card/PublicTeamMembersTableCard';
import PublicJudgesCardWidgetComponent from 'components/widgets/card/PublicJudgesCard';
import PublicVotesCardWidgetComponent from 'components/widgets/card/PublicVotesCard';

const PublicResultPageComponent = () => {
  const { yearId, resultId } = useParams();
  const [teamId, setTeamId] = useState<string>('');
  const [submissionId, setSubmissionId] = useState<string>('');
  const [publicResult, setPublicResult] = useState<
    PublicResult | null | undefined
  >(null);

  useEffect(() => {
    if (!yearId) {
      return;
    }
    if (!resultId) {
      return;
    }
    setTeamId(resultId);
    setSubmissionId(resultId);
  }, [yearId, resultId, setTeamId, setSubmissionId]);

  useEffect(() => {
    if (!yearId) {
      return;
    }
    if (!teamId) {
      return;
    }
    if (!submissionId) {
      return;
    }
    getPublicResult(yearId, teamId, submissionId)
      .then((publicResult) => {
        setPublicResult(publicResult);
      })
      .catch((error) => {
        console.error(error);
        setPublicResult(undefined);
      });
  }, [yearId, teamId, submissionId, setPublicResult]);

  return publicResult === null ? (
    <progress className="progress"></progress>
  ) : publicResult ? (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-start"></h2>
          <div className="card-content flex flex-col justify-start">
            <PublicSubmissionCardWidgetComponent {...publicResult.submission} />
            <PublicTeamCardWidgetComponent {...publicResult.team} />
            <PublicTeamMembersTableCardWidgetComponent
              {...{ publicUsers: publicResult.team.users }}
            />
            <PublicJudgesCardWidgetComponent
              submissionId={publicResult.submissionId}
              publicUserYearJudges={publicResult.judges}
            />
            <PublicVotesCardWidgetComponent
              submissionId={publicResult.submissionId}
              publicUserYearVotes={publicResult.votes}
            />
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default PublicResultPageComponent;
