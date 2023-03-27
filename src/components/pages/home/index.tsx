import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, onSnapshot } from 'utils/firebase';
import AuthSignInPageComponent from 'components/pages/auth/sign-in';
import { useEffect, useState } from 'react';
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
import PrivateUserStatusCardWidgetComponent from 'components/widgets/card/PrivateUserStatusCard';
import PrivateUserTxsTableCardWidgetComponent from 'components/widgets/card/PrivateUserTxsTableCard';
import ServiceOverviewCardWidgetComponent from 'components/widgets/card/ServiceOverviewCard';
import LetsEntryCardWidgetComponent from 'components/widgets/card/LetsEntryCard';
import {
  docRef as privateUserYearSubmissionDocRef,
  getAllPrivateUserYearSubmissions,
  PrivateUserYearSubmission,
} from 'models/private/users/years/submissions';
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

const HomePageComponent = () => {
  const [authUser, authUserLoading] = useAuthState(auth);
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
    if (!authUser) {
      return;
    }
    const userId = authUser.uid;
    getConfigHackathonYearEntry('2023')
      .then((configHackathonYearEntry) => {
        setConfigHackathonYearEntry(configHackathonYearEntry);
      })
      .catch((error) => {
        console.error(error);
      });
    getConfigHackathonYearTeam('2023')
      .then((configHackathonYearTeam) => {
        setConfigHackathonYearTeam(configHackathonYearTeam);
      })
      .catch((error) => {
        console.error(error);
      });
    getConfigHackathonYearSubmission('2023')
      .then((configHackathonYearSubmission) => {
        setConfigHackathonYearSubmission(configHackathonYearSubmission);
      })
      .catch((error) => {
        console.error(error);
      });
    getConfigHackathonYearJudge('2023')
      .then((configHackathonYearJudge) => {
        setConfigHackathonYearJudge(configHackathonYearJudge);
      })
      .catch((error) => {
        console.error(error);
      });
    getConfigHackathonYearVote('2023')
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
    getAllPrivateUserEntries(userId, '2023')
      .then((privateUserYearEntries) => {
        setPrivateUserYearEntry(privateUserYearEntries[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    getAllPrivateUserYearTeams(userId, '2023')
      .then((privateUserYearTeams) => {
        setPrivateUserYearTeam(privateUserYearTeams[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    getAllPrivateUserYearSubmissions(userId, '2023')
      .then((privateUserYearSubmissions) => {
        setPrivateUserYearSubmission(privateUserYearSubmissions[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    getPrivateUserYearJudge(userId, '2023', userId)
      .then((privateUserYearJudge) => {
        setPrivateUserYearJudge(privateUserYearJudge);
      })
      .catch((error) => {
        console.error(error);
      });
    getPrivateUserYearVote(userId, '2023', userId)
      .then((privateUserYearVote) => {
        setPrivateUserYearVote(privateUserYearVote);
      })
      .catch((error) => {
        console.error(error);
      });
    const unsubscribeConfigHackathonYearEntryDocListener = onSnapshot(
      configHackathonYearEntryDocRef('2023'),
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
      configHackathonYearTeamDocRef('2023'),
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
      configHackathonYearSubmissionDocRef('2023'),
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
      configHackathonYearJudgeDocRef('2023'),
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
      configHackathonYearVoteDocRef('2023'),
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
      privateUserYearEntryDocRef(userId, '2023', userId),
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
      privateUserYearTeamDocRef(userId, '2023', userId),
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
      privateUserYearSubmissionDocRef(userId, '2023', userId),
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
      privateUserYearJudgeDocRef(userId, '2023', userId),
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
      privateUserYearVoteDocRef(userId, '2023', userId),
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
      <ServiceOverviewCardWidgetComponent />
      {!authUser && !authUserLoading ? <AuthSignInPageComponent /> : null}
      <LetsEntryCardWidgetComponent />
      {authUser ? (
        <PrivateUserStatusCardWidgetComponent
          yearId="2023"
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
      ) : null}
      {authUser && privateUserTxs?.length ? (
        <PrivateUserTxsTableCardWidgetComponent
          privateUserTxs={privateUserTxs}
        />
      ) : null}
    </>
  );
};

export default HomePageComponent;
