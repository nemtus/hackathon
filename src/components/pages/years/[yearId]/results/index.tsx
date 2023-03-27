import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getAllPublicResults,
  PublicResults,
} from 'models/public/years/results';
import PublicSubmissionCardWidgetComponent from 'components/widgets/card/PublicSubmissionCard';
import PublicTeamCardWidgetComponent from 'components/widgets/card/PublicTeamCard';
import PublicTeamMembersTableCardWidgetComponent from 'components/widgets/card/PublicTeamMembersTableCard';
import PublicJudgesCardWidgetComponent from 'components/widgets/card/PublicJudgesCard';
import PublicVotesCardWidgetComponent from 'components/widgets/card/PublicVotesCard';

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
              <PublicSubmissionCardWidgetComponent
                {...publicResult.submission}
              />
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
        ) : null
      )}
    </>
  ) : (
    <> {loading ? <progress className="progress"></progress> : null}</>
  );
};

export default PublicResultsPageComponent;
