import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicResult, PublicResult } from 'models/public/years/results';
import PublicSubmissionCardWidgetComponent from 'components/widgets/card/PublicSubmissionCard';
import PublicTeamCardWidgetComponent from 'components/widgets/card/PublicTeamCard';
import PublicTeamMembersTableCardWidgetComponent from 'components/widgets/card/PublicTeamMembersTableCard';
import PublicJudgesForAwardCardWidgetComponent from 'components/widgets/card/PublicJudgesForAwardCard';
import PublicVotesForAwardCardWidgetComponent from 'components/widgets/card/PublicVotesForAwardCard';

const PublicResultPageComponent = () => {
  const { yearId, resultId } = useParams();
  const [teamId, setTeamId] = useState<string>('');
  const [submissionId, setSubmissionId] = useState<string>('');
  const [publicResult, setPublicResult] = useState<
    PublicResult | null | undefined
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    getPublicResult(yearId, teamId, submissionId)
      .then((publicResult) => {
        console.log(publicResult);
        setPublicResult(publicResult);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPublicResult(undefined);
        setLoading(false);
      });
  }, [yearId, teamId, submissionId, setPublicResult, setLoading]);

  return publicResult === null ? (
    <progress className="progress"></progress>
  ) : publicResult ? (
    <>
      {loading ? <progress className="progress"></progress> : null}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-wrap justify-between">
            <h2 className="card-title justify-start"></h2>
            <div className="card-title justify-end">
              Total Points:{publicResult.totalPoints} = Judge Points:
              {publicResult.judgesTotalPoints} + Vote Points:
              {publicResult.votesTotalPoints}
            </div>
          </div>
          <div className="card-content flex flex-col justify-start">
            <PublicSubmissionCardWidgetComponent {...publicResult.submission} />
            <PublicTeamCardWidgetComponent {...publicResult.team} />
            <PublicTeamMembersTableCardWidgetComponent
              {...{ publicUsers: publicResult.team.users }}
            />
            <PublicJudgesForAwardCardWidgetComponent
              submissionId={publicResult.submissionId}
              publicUserYearJudges={publicResult.judges}
              judgeUsers={publicResult.judgeUsers}
            />
            <PublicVotesForAwardCardWidgetComponent
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
