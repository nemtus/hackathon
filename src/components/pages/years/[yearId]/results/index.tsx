import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getAllPublicResults,
  PublicResults,
} from 'models/public/years/results';
import PublicSubmissionCardWidgetComponent from 'components/widgets/card/PublicSubmissionCard';
import PublicTeamCardWidgetComponent from 'components/widgets/card/PublicTeamCard';
import PublicTeamMembersTableCardWidgetComponent from 'components/widgets/card/PublicTeamMembersTableCard';
import PublicJudgesForAwardCardWidgetComponent from 'components/widgets/card/PublicJudgesForAwardCard';
import PublicVotesForAwardCardWidgetComponent from 'components/widgets/card/PublicVotesForAwardCard';
import PublicFinalJudgesForAwardCardWidgetComponent from 'components/widgets/card/PublicFinalJudgesForAwardCard';
import PublicFinalVotesForAwardCardWidgetComponent from 'components/widgets/card/PublicFinalVotesForAwardCard';
// import AwardImageComponent from 'components/widgets/common/AwardImage';

const PublicResultsPageComponent = () => {
  const { yearId } = useParams();
  const [order] = useState<'createdTimeAsc' | 'totalPointsDesc'>(
    'createdTimeAsc'
  );
  const [publicResults, setPublicResults] = useState<PublicResults | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!yearId) {
      return;
    }
    setLoading(true);
    getAllPublicResults(yearId, order)
      .then((publicResults) => {
        console.log(publicResults);
        setPublicResults(publicResults);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setPublicResults([]);
        setLoading(false);
      });
  }, [yearId, order, setPublicResults]);

  return publicResults ? (
    <>
      {loading ? <progress className="progress"></progress> : null}
      {publicResults.map((publicResult, index) =>
        publicResult ? (
          <div
            className="card bg-base-100 shadow-xl mb-9"
            key={publicResult.submissionId}
          >
            <div className="card-body">
              <div className="flex flex-wrap justify-between">
                {order === 'createdTimeAsc' ? (
                  <h2 className="card-title justify-start">
                    <a
                      className="link link-primary"
                      href={`/years/${yearId}/results/${publicResult.submissionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Entry No. {index + 1}
                    </a>
                  </h2>
                ) : null}
                {/* <div className="card-title flex flex-wrap justify-start">
                  {publicResult.awards
                    .filter(
                      (award) =>
                        award.submissionId === publicResult.submissionId
                    )
                    .map((award) => (
                      <AwardImageComponent award={award} key={award.index} />
                    ))}
                </div> */}
                <div className="card-title justify-end">
                  Total Points:{publicResult.totalPoints} = Judge Points:
                  {publicResult.judgesTotalPoints} + Vote Points:
                  {publicResult.votesTotalPoints} + Final Judge Points:{' '}
                  {publicResult.finalJudgesTotalPoints} + Final Vote Points:{' '}
                  {publicResult.finalVotesTotalPoints}
                </div>
              </div>
              <PublicSubmissionCardWidgetComponent
                {...publicResult.submission}
              />
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
              <PublicFinalJudgesForAwardCardWidgetComponent
                submissionId={publicResult.submissionId}
                publicUserYearFinalJudges={publicResult.finalJudges}
                judgeUsers={publicResult.judgeUsers}
              />
              <PublicFinalVotesForAwardCardWidgetComponent
                submissionId={publicResult.submissionId}
                publicUserYearFinalVotes={publicResult.finalVotes}
              />
            </div>
          </div>
        ) : null
      )}
    </>
  ) : (
    <> {loading ? <progress className="progress"></progress> : null}</>
  );
};

export default PublicResultsPageComponent;
