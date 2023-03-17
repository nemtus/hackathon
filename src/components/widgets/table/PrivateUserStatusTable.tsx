import { AuthUser } from 'utils/firebase';
import { PrivateUser } from 'models/private/users';
import { PrivateUserTx } from 'models/private/users/txs';
import { PrivateUserYearEntry } from 'models/private/users/years/entries';
import { PrivateUserYearTeam } from 'models/private/users/years/teams';
import { PrivateUserYearSubmission } from 'models/private/users/years/submissions';
import EntryButtonComponent from 'components/widgets/button/EntryButton';
import TeamCreateButton from 'components/widgets/button/TeamCreateButton';
import SubmissionCreateButton from 'components/widgets/button/SubmissionCreateButton';

export type PrivateUserStatus = {
  signInStatus?: 'OK' | 'Unknown';
  accountStatus?:
    | 'Creating'
    | 'Created'
    | 'Tx Announced'
    | 'Tx Unconfirmed'
    | 'Tx Confirmed'
    | 'Unknown';
  entryStatus?:
    | 'Preparing'
    | 'Waiting Account Set Up'
    | 'Not Yet'
    | 'Creating'
    | 'Created'
    | 'Tx Announced'
    | 'Tx Unconfirmed'
    | 'Tx Confirmed'
    | 'Unknown';
  teamStatus?:
    | 'Preparing'
    | 'Waiting Entry'
    | 'Not Yet'
    | 'Now Under Review'
    | 'Creating'
    | 'Created'
    | 'Tx Announced'
    | 'Tx Unconfirmed'
    | 'Tx Confirmed'
    | 'Unknown';
  submissionStatus?:
    | 'Preparing'
    | 'Waiting Team'
    | 'Not Yet'
    | 'Now Under Review'
    | 'Creating'
    | 'Created'
    | 'Tx Announced'
    | 'Tx Unconfirmed'
    | 'Tx Confirmed'
    | 'Unknown';
};

const PrivateUserStatusTableWidgetComponent = (props: {
  yearId: string;
  authUser: AuthUser | null | undefined;
  privateUser: PrivateUser | null | undefined;
  privateUserTxs: PrivateUserTx[] | null | undefined;
  privateUserYearEntry: PrivateUserYearEntry | null | undefined;
  privateUserYearTeam: PrivateUserYearTeam | null | undefined;
  privateUserYearSubmission: PrivateUserYearSubmission | null | undefined;
}) => {
  const signInStatus: PrivateUserStatus['signInStatus'] = props.authUser
    ? 'OK'
    : 'Unknown';
  const accountStatus: PrivateUserStatus['accountStatus'] =
    ((): PrivateUserStatus['accountStatus'] => {
      const createAndSetUpNewAccountTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter((tx) => tx.description === 'CreateAndSetUpNewAccount')[0];
      if (!createAndSetUpNewAccountTx) {
        return 'Creating';
      }
      if (createAndSetUpNewAccountTx.confirmed) {
        return 'Tx Confirmed';
      }
      if (createAndSetUpNewAccountTx.unconfirmed) {
        return 'Tx Unconfirmed';
      }
      if (createAndSetUpNewAccountTx.announced) {
        return 'Tx Announced';
      }
      if (createAndSetUpNewAccountTx.createdAt) {
        return 'Created';
      }
      return 'Unknown';
    })();
  const entryStatus: PrivateUserStatus['entryStatus'] =
    ((): PrivateUserStatus['entryStatus'] => {
      const createAndSetUpNewAccountTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter((tx) => tx.description === 'CreateAndSetUpNewAccount')[0];
      const entryTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter((tx) => tx.description === `Entry${props.yearId}`)[0];
      if (
        !createAndSetUpNewAccountTx ||
        !createAndSetUpNewAccountTx.confirmed
      ) {
        return 'Waiting Account Set Up';
      }
      if (
        createAndSetUpNewAccountTx?.confirmed &&
        !props.privateUserYearEntry
      ) {
        return 'Not Yet';
      }
      if (!entryTx) {
        return 'Creating';
      }
      if (entryTx.confirmed) {
        return 'Tx Confirmed';
      }
      if (entryTx.unconfirmed) {
        return 'Tx Unconfirmed';
      }
      if (entryTx.announced) {
        return 'Tx Announced';
      }
      if (entryTx.createdAt) {
        return 'Created';
      }
      return 'Unknown';
    })();

  const teamStatus: PrivateUserStatus['teamStatus'] =
    ((): PrivateUserStatus['teamStatus'] => {
      const entryTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter((tx) => tx.description === `Entry${props.yearId}`)[0];
      const createTeamTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter(
          (tx) => tx.description === `CreateAndSetUpNewTeam${props.yearId}`
        )[0];
      const updateTeamTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter((tx) => tx.description === `UpdateTeamInfo${props.yearId}`)[0];
      if (!entryTx || !entryTx.confirmed) {
        return 'Waiting Entry';
      }
      if (entryTx?.confirmed && !props.privateUserYearTeam) {
        return 'Not Yet';
      }
      if (
        entryTx?.confirmed &&
        props.privateUserYearTeam &&
        props.privateUserYearTeam.approved === false
      ) {
        return 'Now Under Review';
      }
      if (updateTeamTx?.confirmed) {
        return 'Tx Confirmed';
      }
      if (updateTeamTx?.unconfirmed) {
        return 'Tx Unconfirmed';
      }
      if (updateTeamTx?.announced) {
        return 'Tx Announced';
      }
      if (updateTeamTx?.createdAt) {
        return 'Created';
      }
      if (!createTeamTx) {
        return 'Creating';
      }
      if (createTeamTx.confirmed) {
        return 'Tx Confirmed';
      }
      if (createTeamTx.unconfirmed) {
        return 'Tx Unconfirmed';
      }
      if (createTeamTx.announced) {
        return 'Tx Announced';
      }
      if (createTeamTx.createdAt) {
        return 'Created';
      }
      return 'Unknown';
    })();

  const submissionStatus: PrivateUserStatus['submissionStatus'] =
    ((): PrivateUserStatus['submissionStatus'] => {
      const createTeamTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter(
          (tx) => tx.description === `CreateAndSetUpNewTeam${props.yearId}`
        )[0];
      const createSubmissionTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter(
          (tx) => tx.description === `CreateNewSubmission${props.yearId}`
        )[0];
      const updateSubmissionTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter(
          (tx) => tx.description === `UpdateSubmission${props.yearId}`
        )[0];
      if (!createTeamTx || !createTeamTx.confirmed) {
        return 'Waiting Team';
      }
      if (createTeamTx?.confirmed && !props.privateUserYearSubmission) {
        return 'Not Yet';
      }
      if (
        createTeamTx?.confirmed &&
        props.privateUserYearSubmission &&
        props.privateUserYearSubmission.approved === false
      ) {
        return 'Now Under Review';
      }
      if (updateSubmissionTx?.confirmed) {
        return 'Tx Confirmed';
      }
      if (updateSubmissionTx?.unconfirmed) {
        return 'Tx Unconfirmed';
      }
      if (updateSubmissionTx?.announced) {
        return 'Tx Announced';
      }
      if (updateSubmissionTx?.createdAt) {
        return 'Created';
      }
      if (!createSubmissionTx) {
        return 'Creating';
      }
      if (createSubmissionTx.confirmed) {
        return 'Tx Confirmed';
      }
      if (createSubmissionTx.unconfirmed) {
        return 'Tx Unconfirmed';
      }
      if (createSubmissionTx.announced) {
        return 'Tx Announced';
      }
      if (createSubmissionTx.createdAt) {
        return 'Created';
      }
      return 'Unknown';
    })();

  const privateUserStatus: PrivateUserStatus = {
    signInStatus,
    accountStatus,
    entryStatus,
    teamStatus,
    submissionStatus,
  };

  return (
    <table className="table table-compact w-full">
      <thead>
        <tr>
          <th>Process</th>
          <th>Status</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr key="signIn">
          <td>Sign In</td>
          <td>
            {privateUserStatus.signInStatus === 'OK' ? (
              <span className="text-success">✔</span>
            ) : (
              <span>?</span>
            )}
          </td>
          <td>
            <span>{privateUserStatus.signInStatus}</span>
          </td>
        </tr>
        <tr key="accountStatus">
          <td>Set Up Account</td>
          <td>
            {privateUserStatus.accountStatus === 'Tx Confirmed' ? (
              <span className="text-success">✔</span>
            ) : privateUserStatus.accountStatus === 'Unknown' ? (
              <span>?</span>
            ) : (
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            )}
          </td>
          <td>
            <span>{privateUserStatus.accountStatus}</span>
          </td>
        </tr>
        <tr key="entryStatus">
          <td>Entry</td>
          <td>
            {privateUserStatus.entryStatus === 'Tx Confirmed' ? (
              <span className="text-success">✔</span>
            ) : privateUserStatus.entryStatus === 'Unknown' ? (
              <span>?</span>
            ) : privateUserStatus.entryStatus === 'Not Yet' ? (
              <EntryButtonComponent
                userId={props.privateUser?.id ?? ''}
                yearId={props.yearId}
                disabled={false}
              />
            ) : (
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            )}
          </td>
          <td>
            <span>{privateUserStatus.entryStatus}</span>
          </td>
        </tr>
        <tr key="teamStatus">
          <td>Set Up Team</td>
          <td>
            {privateUserStatus.teamStatus === 'Tx Confirmed' ? (
              <span className="text-success">✔</span>
            ) : privateUserStatus.teamStatus === 'Unknown' ? (
              <span>?</span>
            ) : privateUserStatus.teamStatus === 'Not Yet' ? (
              <TeamCreateButton
                userId={props.privateUser?.id ?? ''}
                yearId={props.yearId}
                disabled={false}
              />
            ) : (
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            )}
          </td>
          <td>
            <span>{privateUserStatus.teamStatus}</span>
            <span>
              {privateUserStatus.teamStatus === 'Now Under Review'
                ? ' : This process is manually executed by NEMTUS internal members and may take up to a day to complete.'
                : null}
            </span>
          </td>
        </tr>
        <tr key="submissionStatus">
          <td>Submission</td>
          <td>
            {privateUserStatus.submissionStatus === 'Tx Confirmed' ? (
              <span className="text-success">✔</span>
            ) : privateUserStatus.submissionStatus === 'Unknown' ? (
              <span>?</span>
            ) : privateUserStatus.submissionStatus === 'Not Yet' ? (
              <SubmissionCreateButton
                userId={props.privateUser?.id ?? ''}
                yearId={props.yearId}
                disabled={false}
              />
            ) : (
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            )}
          </td>
          <td>
            <span>{privateUserStatus.submissionStatus}</span>
            <span>
              {privateUserStatus.submissionStatus === 'Now Under Review'
                ? ' : This process is manually executed by NEMTUS internal members and may take up to a day to complete.'
                : null}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PrivateUserStatusTableWidgetComponent;
