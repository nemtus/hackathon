import { PrivateUserYearEntry } from 'models/private/users/years/entries';

const PrivateUserYearEntryCardWidgetComponent = (
  privateUserYearEntry: PrivateUserYearEntry
) => {
  const {
    // id,
    yearId,
    // userId,
    createdAt,
    // updatedAt
  } = privateUserYearEntry;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">
          NEMTUS Hackathon {yearId} Entry
        </h2>
        <div className="card-content flex justify-start">
          <div className="stats">
            <div className="stat">
              <div className="stat-value">
                {createdAt ? (
                  <span className="bg-success">Completed</span>
                ) : (
                  <span className="bg-error">Not completed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateUserYearEntryCardWidgetComponent;
