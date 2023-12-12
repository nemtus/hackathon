import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  docRef as privateUserDocRef,
  getPrivateUser,
  PrivateUser,
} from 'models/private/users';
import {
  collectionRef as privateUserTxsCollectionRef,
  getAllPrivateUserTxs,
  PrivateUserTxs,
} from 'models/private/users/txs';
import {
  docRef as privateUserYearEntryDocRef,
  getAllPrivateUserEntries,
  PrivateUserYearEntry,
} from 'models/private/users/years/entries';
import {
  docRef as privateUserYearTeamDocRef,
  getAllPrivateUserYearTeams,
  PrivateUserYearTeam,
} from 'models/private/users/years/teams';
import PrivateUserCardWidgetComponent from 'components/widgets/card/PrivateUserCard';
import PrivateUserTxsTableCardWidgetComponent from 'components/widgets/card/PrivateUserTxsTableCard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, onSnapshot } from 'utils/firebase';
import PrivateUserStatusCardWidgetComponent from 'components/widgets/card/PrivateUserStatusCard';
import PrivateUserTeamCardWidgetComponent from 'components/widgets/card/PrivateUserTeamCard';
import PrivateUserTeamMembersTableCardWidgetComponent from 'components/widgets/card/PrivateUserTeamMembersTableCard';
import {
  docRef as privateUserYearSubmissionDocRef,
  getAllPrivateUserYearSubmissions,
  PrivateUserYearSubmission,
} from 'models/private/users/years/submissions';
import PrivateUserSubmissionCardWidgetComponent from 'components/widgets/card/PrivateUserSubmissionCard';
import {
  docRef as configHackathonYearEntryDocRef,
  ConfigHackathonYearEntry,
  getConfigHackathonYearEntry,
} from 'models/configs/hackathon/years/entry';
import {
  docRef as configHackathonYearTeamDocRef,
  ConfigHackathonYearTeam,
  getConfigHackathonYearTeam,
} from 'models/configs/hackathon/years/team';
import {
  docRef as configHackathonYearSubmissionDocRef,
  ConfigHackathonYearSubmission,
  getConfigHackathonYearSubmission,
} from 'models/configs/hackathon/years/submission';
import {
  docRef as configHackathonYearJudgeDocRef,
  ConfigHackathonYearJudge,
  getConfigHackathonYearJudge,
} from 'models/configs/hackathon/years/judge';
import {
  docRef as configHackathonYearVoteDocRef,
  ConfigHackathonYearVote,
  getConfigHackathonYearVote,
} from 'models/configs/hackathon/years/vote';
import {
  docRef as privateUserYearJudgeDocRef,
  getPrivateUserYearJudge,
  PrivateUserYearJudge,
} from 'models/private/users/years/judges';
import {
  docRef as privateUserYearVoteDocRef,
  getPrivateUserYearVote,
  PrivateUserYearVote,
} from 'models/private/users/years/votes';
import PrivateUserJudgeCardWidgetComponent from 'components/widgets/card/PrivateUserJudgeCard';
import PrivateUserVoteCardWidgetComponent from 'components/widgets/card/PrivateUserVoteCard';

const CURRENT_YEAR = process.env.REACT_APP_CURRENT_YEAR;
if (!CURRENT_YEAR) {
  throw Error('REACT_APP_CURRENT_YEAR is not defined');
}

const UserPageComponent = () => {
  const { userId } = useParams();
  const [authUser] = useAuthState(auth);
  const [configHackathonYearEntry, setConfigHackathonYearEntry] = useState<
    ConfigHackathonYearEntry | null | undefined
  >(null);
  const [configHackathonYearTeam, setConfigHackathonYearTeam] = useState<
    ConfigHackathonYearTeam | null | undefined
  >(null);
  const [configHackathonYearSubmission, setConfigHackathonYearSubmission] =
    useState<ConfigHackathonYearSubmission | null | undefined>(null);
  const [configHackathonYearJudge, setConfigHackathonYearJudge] = useState<
    ConfigHackathonYearJudge | null | undefined
  >(null);
  const [configHackathonYearVote, setConfigHackathonYearVote] = useState<
    ConfigHackathonYearVote | null | undefined
  >(null);
  const [privateUser, setPrivateUser] = useState<
    PrivateUser | null | undefined
  >(null);
  const [privateUserTxs, setPrivateUserTxs] = useState<
    PrivateUserTxs | null | undefined
  >(null);
  const [privateUserYearEntry, setPrivateUserYearEntry] = useState<
    PrivateUserYearEntry | null | undefined
  >(null);
  const [privateUserYearTeam, setPrivateUserYearTeam] = useState<
    PrivateUserYearTeam | null | undefined
  >(null);
  const [privateUserYearSubmission, setPrivateUserYearSubmission] = useState<
    PrivateUserYearSubmission | null | undefined
  >(null);
  const [privateUserYearJudge, setPrivateUserYearJudge] = useState<
    PrivateUserYearJudge | null | undefined
  >(null);
  const [privateUserYearVote, setPrivateUserYearVote] = useState<
    PrivateUserYearVote | null | undefined
  >(null);

  useEffect(() => {
    if (!userId) {
      return;
    }
    if (authUser?.uid !== userId) {
      return;
    }
    getConfigHackathonYearEntry(CURRENT_YEAR)
      .then((configHackathonYearEntry) => {
        setConfigHackathonYearEntry(configHackathonYearEntry);
      })
      .catch((error) => {
        console.error(error);
      });
    getConfigHackathonYearTeam(CURRENT_YEAR)
      .then((configHackathonYearTeam) => {
        setConfigHackathonYearTeam(configHackathonYearTeam);
      })
      .catch((error) => {
        console.error(error);
      });
    getConfigHackathonYearSubmission(CURRENT_YEAR)
      .then((configHackathonYearSubmission) => {
        setConfigHackathonYearSubmission(configHackathonYearSubmission);
      })
      .catch((error) => {
        console.error(error);
      });
    getConfigHackathonYearJudge(CURRENT_YEAR)
      .then((configHackathonYearJudge) => {
        setConfigHackathonYearJudge(configHackathonYearJudge);
      })
      .catch((error) => {
        console.error(error);
      });
    getConfigHackathonYearVote(CURRENT_YEAR)
      .then((configHackathonYearVote) => {
        setConfigHackathonYearVote(configHackathonYearVote);
      })
      .catch((error) => {
        console.error(error);
      });
    getPrivateUser(userId)
      .then((privateUser) => {
        setPrivateUser(privateUser);
      })
      .catch((error) => {
        console.error(error);
      });
    getAllPrivateUserTxs(userId)
      .then((privateUserTxs) => {
        setPrivateUserTxs(privateUserTxs);
      })
      .catch((error) => {
        console.error(error);
      });
    getAllPrivateUserEntries(userId, CURRENT_YEAR)
      .then((privateUserEntries) => {
        setPrivateUserYearEntry(privateUserEntries[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    getAllPrivateUserYearTeams(userId, CURRENT_YEAR)
      .then((privateUserYearTeams) => {
        setPrivateUserYearTeam(privateUserYearTeams[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    getAllPrivateUserYearSubmissions(userId, CURRENT_YEAR)
      .then((privateUserYearSubmissions) => {
        setPrivateUserYearSubmission(privateUserYearSubmissions[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    getPrivateUserYearJudge(userId, CURRENT_YEAR, userId)
      .then((privateUserYearJudge) => {
        setPrivateUserYearJudge(privateUserYearJudge);
      })
      .catch((error) => {
        console.error(error);
      });
    getPrivateUserYearVote(userId, CURRENT_YEAR, userId)
      .then((privateUserYearVote) => {
        setPrivateUserYearVote(privateUserYearVote);
      })
      .catch((error) => {
        console.error(error);
      });
    const unsubscribeConfigHackathonYearEntryDocListener = onSnapshot(
      configHackathonYearEntryDocRef(CURRENT_YEAR),
      {
        includeMetadataChanges: true,
      },
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearEntry(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearTeamDocListener = onSnapshot(
      configHackathonYearTeamDocRef(CURRENT_YEAR),
      {
        includeMetadataChanges: true,
      },
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearTeam(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearSubmissionDocListener = onSnapshot(
      configHackathonYearSubmissionDocRef(CURRENT_YEAR),
      {
        includeMetadataChanges: true,
      },
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearSubmission(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearJudgeDocListener = onSnapshot(
      configHackathonYearJudgeDocRef(CURRENT_YEAR),
      {
        includeMetadataChanges: true,
      },
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearJudge(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearVoteDocListener = onSnapshot(
      configHackathonYearVoteDocRef(CURRENT_YEAR),
      {
        includeMetadataChanges: true,
      },
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearVote(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserDocListener = onSnapshot(
      privateUserDocRef(userId),
      {
        includeMetadataChanges: true,
      },
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setPrivateUser(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserTxsCollectionListener = onSnapshot(
      privateUserTxsCollectionRef(userId),
      {
        includeMetadataChanges: true,
      },
      {
        next: (snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          if (data.length) {
            setPrivateUserTxs(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserYearEntryDocListener = onSnapshot(
      privateUserYearEntryDocRef(userId, CURRENT_YEAR, userId),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setPrivateUserYearEntry(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserYearTeamDocListener = onSnapshot(
      privateUserYearTeamDocRef(userId, CURRENT_YEAR, userId),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setPrivateUserYearTeam(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserYearSubmissionDocListener = onSnapshot(
      privateUserYearSubmissionDocRef(userId, CURRENT_YEAR, userId),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setPrivateUserYearSubmission(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserYearJudgeDocListener = onSnapshot(
      privateUserYearJudgeDocRef(userId, CURRENT_YEAR, userId),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setPrivateUserYearJudge(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserYearVoteDocListener = onSnapshot(
      privateUserYearVoteDocRef(userId, CURRENT_YEAR, userId),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setPrivateUserYearVote(data);
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );

    return () => {
      unsubscribeConfigHackathonYearEntryDocListener();
      unsubscribeConfigHackathonYearTeamDocListener();
      unsubscribeConfigHackathonYearSubmissionDocListener();
      unsubscribeConfigHackathonYearJudgeDocListener();
      unsubscribeConfigHackathonYearVoteDocListener();
      unsubscribePrivateUserDocListener();
      unsubscribePrivateUserTxsCollectionListener();
      unsubscribePrivateUserYearEntryDocListener();
      unsubscribePrivateUserYearTeamDocListener();
      unsubscribePrivateUserYearSubmissionDocListener();
      unsubscribePrivateUserYearJudgeDocListener();
      unsubscribePrivateUserYearVoteDocListener();
    };
  }, [
    userId,
    authUser,
    setConfigHackathonYearEntry,
    setConfigHackathonYearTeam,
    setConfigHackathonYearSubmission,
    setConfigHackathonYearJudge,
    setConfigHackathonYearVote,
    setPrivateUser,
    setPrivateUserTxs,
    setPrivateUserYearEntry,
    setPrivateUserYearTeam,
    setPrivateUserYearSubmission,
    setPrivateUserYearJudge,
    setPrivateUserYearVote,
  ]);

  return (
    <>
      <PrivateUserStatusCardWidgetComponent
        yearId={CURRENT_YEAR}
        authUser={authUser}
        configHackathonYearEntry={configHackathonYearEntry}
        configHackathonYearTeam={configHackathonYearTeam}
        configHackathonYearSubmission={configHackathonYearSubmission}
        configHackathonYearJudge={configHackathonYearJudge}
        configHackathonYearVote={configHackathonYearVote}
        privateUser={privateUser}
        privateUserTxs={privateUserTxs}
        privateUserYearEntry={privateUserYearEntry}
        privateUserYearTeam={privateUserYearTeam}
        privateUserYearSubmission={privateUserYearSubmission}
        privateUserYearJudge={privateUserYearJudge}
        privateUserYearVote={privateUserYearVote}
      />
      {privateUser ? <PrivateUserCardWidgetComponent {...privateUser} /> : null}
      {privateUserYearTeam ? (
        <PrivateUserTeamCardWidgetComponent {...privateUserYearTeam} />
      ) : null}
      {privateUserYearTeam?.users ? (
        <PrivateUserTeamMembersTableCardWidgetComponent
          {...{ publicUsers: privateUserYearTeam.users }}
        />
      ) : null}
      {privateUserYearSubmission ? (
        <PrivateUserSubmissionCardWidgetComponent
          {...privateUserYearSubmission}
        />
      ) : null}
      {privateUserYearJudge ? (
        <PrivateUserJudgeCardWidgetComponent {...privateUserYearJudge} />
      ) : null}
      {privateUserYearVote ? (
        <PrivateUserVoteCardWidgetComponent {...privateUserYearVote} />
      ) : null}
      {privateUserTxs?.length ? (
        <PrivateUserTxsTableCardWidgetComponent
          privateUserTxs={privateUserTxs}
        />
      ) : null}
    </>
  );
};

export default UserPageComponent;
