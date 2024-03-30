import { PrivateUser } from 'models/private/users';
import { AuthUser } from 'utils/firebase';
import { PrivateUserTx } from 'models/private/users/txs';
import { PrivateUserYearEntry } from 'models/private/users/years/entries';
import PrivateUserStatusTableWidgetComponent from '../table/PrivateUserStatusTable';
import { PrivateUserYearTeam } from 'models/private/users/years/teams';
import { PrivateUserYearSubmission } from 'models/private/users/years/submissions';
import { PrivateUserYearJudge } from 'models/private/users/years/judges';
import { PrivateUserYearVote } from 'models/private/users/years/votes';
import { PrivateUserYearFinalJudge } from 'models/private/users/years/final-judges';
import { PrivateUserYearFinalVote } from 'models/private/users/years/final-votes';
import { ConfigHackathonYearEntry } from 'models/configs/hackathon/years/entry';
import { ConfigHackathonYearJudge } from 'models/configs/hackathon/years/judge';
import { ConfigHackathonYearSubmission } from 'models/configs/hackathon/years/submission';
import { ConfigHackathonYearTeam } from 'models/configs/hackathon/years/team';
import { ConfigHackathonYearVote } from 'models/configs/hackathon/years/vote';
import { ConfigHackathonYearFinalJudge } from 'models/configs/hackathon/years/final-judge';
import { ConfigHackathonYearFinalVote } from 'models/configs/hackathon/years/final-vote';

const PrivateUserStatusCardWidgetComponent = (props: {
  yearId: string;
  authUser: AuthUser | null | undefined;
  configHackathonYearEntry: ConfigHackathonYearEntry | null | undefined;
  configHackathonYearTeam: ConfigHackathonYearTeam | null | undefined;
  configHackathonYearSubmission:
    | ConfigHackathonYearSubmission
    | null
    | undefined;
  configHackathonYearJudge: ConfigHackathonYearJudge | null | undefined;
  configHackathonYearVote: ConfigHackathonYearVote | null | undefined;
  configHackathonYearFinalJudge:
    | ConfigHackathonYearFinalJudge
    | null
    | undefined;
  configHackathonYearFinalVote: ConfigHackathonYearFinalVote | null | undefined;
  privateUser: PrivateUser | null | undefined;
  privateUserTxs: PrivateUserTx[] | null | undefined;
  privateUserYearEntry: PrivateUserYearEntry | null | undefined;
  privateUserYearTeam: PrivateUserYearTeam | null | undefined;
  privateUserYearSubmission: PrivateUserYearSubmission | null | undefined;
  privateUserYearJudge: PrivateUserYearJudge | null | undefined;
  privateUserYearVote: PrivateUserYearVote | null | undefined;
  privateUserYearFinalJudge: PrivateUserYearFinalJudge | null | undefined;
  privateUserYearFinalVote: PrivateUserYearFinalVote | null | undefined;
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-start">
          Your Status in the {props.yearId} Hackathon
        </h2>
        <div className="card-content flex justify-start">
          <PrivateUserStatusTableWidgetComponent {...props} />
        </div>
      </div>
    </div>
  );
};

export default PrivateUserStatusCardWidgetComponent;
