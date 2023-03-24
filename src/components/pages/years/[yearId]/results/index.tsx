import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getAllPublicResults,
  PublicResults,
} from 'models/public/years/results';
import PublicSubmissionCardWidgetComponent from 'components/widgets/card/PublicSubmissionCard';
import PublicTeamCardWidgetComponent from 'components/widgets/card/PublicTeamCard';
import PublicTeamMembersTableCardWidgetComponent from 'components/widgets/card/PublicTeamMembersTableCard';

const PublicResultsPageComponent = () => {
  const { yearId } = useParams();
  const [order, setOrder] = useState<'createdTimeAsc' | 'totalPointsDesc'>(
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
                  Entry No. {index + 1}
                </h2>
              ) : null}
              <PublicSubmissionCardWidgetComponent
                {...publicResult.submission}
              />
              <PublicTeamCardWidgetComponent {...publicResult.team} />
              <PublicTeamMembersTableCardWidgetComponent
                {...{ publicUsers: publicResult.team.users }}
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
