import { useEffect, useState } from 'react';
import { AuthUser } from 'utils/firebase';
import { PrivateUser } from 'models/private/users';
import { PrivateUserTx } from 'models/private/users/txs';
import { PrivateUserYearEntry } from 'models/private/users/years/entries';
import { PrivateUserYearTeam } from 'models/private/users/years/teams';
import { PrivateUserYearSubmission } from 'models/private/users/years/submissions';
import { PrivateUserYearVote } from 'models/private/users/years/votes';
import { PrivateUserYearJudge } from 'models/private/users/years/judges';
import EntryButtonComponent from 'components/widgets/button/EntryButton';
import TeamCreateButton from 'components/widgets/button/TeamCreateButton';
import SubmissionCreateButton from 'components/widgets/button/SubmissionCreateButton';
import JudgeCreateButton from 'components/widgets/button/JudgeCreateButton';
import VoteCreateButton from 'components/widgets/button/VoteCreateButton';
import { ConfigHackathonYearEntry } from 'models/configs/hackathon/years/entry';
import { ConfigHackathonYearTeam } from 'models/configs/hackathon/years/team';
import { ConfigHackathonYearSubmission } from 'models/configs/hackathon/years/submission';
import { ConfigHackathonYearJudge } from 'models/configs/hackathon/years/judge';
import { ConfigHackathonYearVote } from 'models/configs/hackathon/years/vote';

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
    | 'Closed'
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
    | 'Closed'
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
    | 'Closed'
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
  judgeStatus?:
    | 'Closed'
    | 'Limited'
    | 'Preparing'
    | 'Waiting Account Set Up'
    | 'Not Yet'
    | 'Now Under Review'
    | 'Creating'
    | 'Created'
    | 'Tx Announced'
    | 'Tx Unconfirmed'
    | 'Tx Confirmed'
    | 'Unknown';
  voteStatus?:
    | 'Closed'
    | 'Limited'
    | 'Preparing'
    | 'Waiting Account Set Up'
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
  configHackathonYearEntry: ConfigHackathonYearEntry | null | undefined;
  configHackathonYearTeam: ConfigHackathonYearTeam | null | undefined;
  configHackathonYearSubmission:
    | ConfigHackathonYearSubmission
    | null
    | undefined;
  configHackathonYearJudge: ConfigHackathonYearJudge | null | undefined;
  configHackathonYearVote: ConfigHackathonYearVote | null | undefined;
  privateUser: PrivateUser | null | undefined;
  privateUserTxs: PrivateUserTx[] | null | undefined;
  privateUserYearEntry: PrivateUserYearEntry | null | undefined;
  privateUserYearTeam: PrivateUserYearTeam | null | undefined;
  privateUserYearSubmission: PrivateUserYearSubmission | null | undefined;
  privateUserYearVote: PrivateUserYearVote | null | undefined;
  privateUserYearJudge: PrivateUserYearJudge | null | undefined;
}) => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setInterval(() => setNow(new Date()), 1000);
  }, [setNow]);

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
        props.configHackathonYearEntry &&
        now < props.configHackathonYearEntry.startAt
      ) {
        return 'Preparing';
      }
      if (
        props.configHackathonYearEntry &&
        props.configHackathonYearEntry.endAt < now
      ) {
        if (entryTx?.confirmed) {
          return 'Tx Confirmed';
        }
        if (entryTx?.unconfirmed) {
          return 'Tx Unconfirmed';
        }
        if (entryTx?.announced) {
          return 'Tx Announced';
        }
        if (entryTx?.createdAt) {
          return 'Created';
        }
        return 'Closed';
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
      if (
        props.configHackathonYearTeam &&
        now < props.configHackathonYearTeam.startAt
      ) {
        return 'Preparing';
      }
      if (
        props.configHackathonYearTeam &&
        props.configHackathonYearTeam.endAt < now
      ) {
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
        if (createTeamTx?.confirmed) {
          return 'Tx Confirmed';
        }
        if (createTeamTx?.unconfirmed) {
          return 'Tx Unconfirmed';
        }
        if (createTeamTx?.announced) {
          return 'Tx Announced';
        }
        if (createTeamTx?.createdAt) {
          return 'Created';
        }
        return 'Closed';
      }
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
      if (
        props.configHackathonYearSubmission &&
        now < props.configHackathonYearSubmission.startAt
      ) {
        return 'Preparing';
      }
      if (
        props.configHackathonYearSubmission &&
        props.configHackathonYearSubmission.endAt < now
      ) {
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
        if (createSubmissionTx?.confirmed) {
          return 'Tx Confirmed';
        }
        if (createSubmissionTx?.unconfirmed) {
          return 'Tx Unconfirmed';
        }
        if (createSubmissionTx?.announced) {
          return 'Tx Announced';
        }
        if (createSubmissionTx?.createdAt) {
          return 'Created';
        }
        return 'Closed';
      }
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

  const judgeStatus: PrivateUserStatus['judgeStatus'] =
    ((): PrivateUserStatus['judgeStatus'] => {
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
      const createJudgeTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter((tx) => tx.description === `CreateNewJudge${props.yearId}`)[0];
      if (
        !createAndSetUpNewAccountTx ||
        !createAndSetUpNewAccountTx.confirmed
      ) {
        return 'Waiting Account Set Up';
      }
      if (
        !props.configHackathonYearJudge?.users.some(
          (userId) => userId === props.authUser?.uid
        )
      ) {
        return 'Limited';
      }
      if (
        props.configHackathonYearJudge &&
        now < props.configHackathonYearJudge.startAt
      ) {
        return 'Preparing';
      }
      if (
        props.configHackathonYearJudge &&
        props.configHackathonYearJudge.endAt < now
      ) {
        if (
          createAndSetUpNewAccountTx?.confirmed &&
          props.privateUserYearJudge &&
          props.privateUserYearJudge.approved === false
        ) {
          return 'Now Under Review';
        }
        if (createJudgeTx?.confirmed) {
          return 'Tx Confirmed';
        }
        if (createJudgeTx?.unconfirmed) {
          return 'Tx Unconfirmed';
        }
        if (createJudgeTx?.announced) {
          return 'Tx Announced';
        }
        if (createJudgeTx?.createdAt) {
          return 'Created';
        }
        return 'Closed';
      }
      if (
        createAndSetUpNewAccountTx?.confirmed &&
        !props.privateUserYearJudge
      ) {
        return 'Not Yet';
      }
      if (
        createAndSetUpNewAccountTx?.confirmed &&
        props.privateUserYearJudge &&
        props.privateUserYearJudge.approved === false
      ) {
        return 'Now Under Review';
      }
      if (!createJudgeTx) {
        return 'Creating';
      }
      if (createJudgeTx.confirmed) {
        return 'Tx Confirmed';
      }
      if (createJudgeTx.unconfirmed) {
        return 'Tx Unconfirmed';
      }
      if (createJudgeTx.announced) {
        return 'Tx Announced';
      }
      if (createJudgeTx.createdAt) {
        return 'Created';
      }
      return 'Unknown';
    })();

  const voteStatus: PrivateUserStatus['voteStatus'] =
    ((): PrivateUserStatus['voteStatus'] => {
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
      const createVoteTx = props.privateUserTxs
        ?.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) {
            return 0;
          }
          if (a.createdAt > b.createdAt) return -1;
          if (b.createdAt < a.createdAt) return 1;
          return 0;
        })
        .filter((tx) => tx.description === `CreateNewVote${props.yearId}`)[0];
      if (
        !createAndSetUpNewAccountTx ||
        !createAndSetUpNewAccountTx.confirmed
      ) {
        return 'Waiting Account Set Up';
      }
      if (
        props.configHackathonYearJudge?.users.some(
          (userId) => userId === props.authUser?.uid
        )
      ) {
        return 'Limited';
      }
      if (props.privateUserYearSubmission) {
        return 'Limited';
      }
      if (
        props.configHackathonYearVote &&
        now < props.configHackathonYearVote.startAt
      ) {
        return 'Preparing';
      }
      if (
        props.configHackathonYearVote &&
        props.configHackathonYearVote.endAt < now
      ) {
        if (
          createAndSetUpNewAccountTx?.confirmed &&
          props.privateUserYearVote &&
          props.privateUserYearVote.approved === false
        ) {
          return 'Now Under Review';
        }
        if (createVoteTx?.confirmed) {
          return 'Tx Confirmed';
        }
        if (createVoteTx?.unconfirmed) {
          return 'Tx Unconfirmed';
        }
        if (createVoteTx?.announced) {
          return 'Tx Announced';
        }
        if (createVoteTx?.createdAt) {
          return 'Created';
        }
        return 'Closed';
      }
      if (createAndSetUpNewAccountTx?.confirmed && !props.privateUserYearVote) {
        return 'Not Yet';
      }
      if (
        createAndSetUpNewAccountTx?.confirmed &&
        props.privateUserYearVote &&
        props.privateUserYearVote.approved === false
      ) {
        return 'Now Under Review';
      }
      if (!createVoteTx) {
        return 'Creating';
      }
      if (createVoteTx.confirmed) {
        return 'Tx Confirmed';
      }
      if (createVoteTx.unconfirmed) {
        return 'Tx Unconfirmed';
      }
      if (createVoteTx.announced) {
        return 'Tx Announced';
      }
      if (createVoteTx.createdAt) {
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
    judgeStatus,
    voteStatus,
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
            ) : privateUserStatus.entryStatus === 'Closed' ? (
              <span className="text-error">-</span>
            ) : privateUserStatus.entryStatus === 'Preparing' ? (
              <span className="text-success">-</span>
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
            ) : privateUserStatus.teamStatus === 'Closed' ? (
              <span className="text-error">-</span>
            ) : privateUserStatus.teamStatus === 'Preparing' ? (
              <span className="text-success">-</span>
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
            ) : privateUserStatus.submissionStatus === 'Closed' ? (
              <span className="text-error">-</span>
            ) : privateUserStatus.submissionStatus === 'Preparing' ? (
              <span className="text-success">-</span>
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
        <tr key="judgeStatus">
          <td>Judge</td>
          <td>
            {privateUserStatus.judgeStatus === 'Tx Confirmed' ? (
              <span className="text-success">✔</span>
            ) : privateUserStatus.judgeStatus === 'Unknown' ? (
              <span>?</span>
            ) : privateUserStatus.judgeStatus === 'Not Yet' ? (
              <JudgeCreateButton
                userId={props.privateUser?.id ?? ''}
                yearId={props.yearId}
                disabled={false}
              />
            ) : privateUserStatus.judgeStatus === 'Limited' ? (
              <span className="text-error">-</span>
            ) : privateUserStatus.judgeStatus === 'Closed' ? (
              <span className="text-error">-</span>
            ) : privateUserStatus.judgeStatus === 'Preparing' ? (
              <span className="text-success">-</span>
            ) : (
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            )}
          </td>
          <td>
            <span>{privateUserStatus.judgeStatus}</span>
            <span>
              {privateUserStatus.judgeStatus === 'Now Under Review'
                ? ' : This process is manually executed by NEMTUS internal members and may take up to a day to complete.'
                : null}
            </span>
          </td>
        </tr>
        <tr key="voteStatus">
          <td>Vote</td>
          <td>
            {privateUserStatus.voteStatus === 'Tx Confirmed' ? (
              <span className="text-success">✔</span>
            ) : privateUserStatus.voteStatus === 'Unknown' ? (
              <span>?</span>
            ) : privateUserStatus.voteStatus === 'Not Yet' ? (
              <VoteCreateButton
                userId={props.privateUser?.id ?? ''}
                yearId={props.yearId}
                disabled={false}
              />
            ) : privateUserStatus.voteStatus === 'Limited' ? (
              <span className="text-error">-</span>
            ) : privateUserStatus.voteStatus === 'Closed' ? (
              <span className="text-error">-</span>
            ) : privateUserStatus.voteStatus === 'Preparing' ? (
              <span className="text-success">-</span>
            ) : (
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            )}
          </td>
          <td>
            <span>{privateUserStatus.voteStatus}</span>
            <span>
              {privateUserStatus.voteStatus === 'Now Under Review'
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
