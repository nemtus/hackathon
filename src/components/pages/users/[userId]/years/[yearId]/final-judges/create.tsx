import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  docRef as privateUserDocRef,
  getPrivateUser,
  PrivateUser,
} from 'models/private/users';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, onSnapshot } from 'utils/firebase';
import {
  docRef as privateUserYearEntryDocRef,
  getAllPrivateUserEntries,
  PrivateUserYearEntry,
} from 'models/private/users/years/entries';
import {
  docRef as privateUserYearTeamDocRef,
  getPrivateUserYearTeam,
  PrivateUserYearTeam,
} from 'models/private/users/years/teams';
import PrivateUserYearFinalJudgeCreateFormWidgetComponent from 'components/widgets/form/PrivateUserFinalJudgeCreateForm';
import {
  docRef as privateUserYearSubmissionDocRef,
  getPrivateUserYearSubmission,
  PrivateUserYearSubmission,
} from 'models/private/users/years/submissions';
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
  docRef as configHackathonYearFinalJudgeDocRef,
  ConfigHackathonYearFinalJudge,
  getConfigHackathonYearFinalJudge,
} from 'models/configs/hackathon/years/final-judge';
import {
  docRef as configHackathonYearFinalVoteDocRef,
  ConfigHackathonYearFinalVote,
  getConfigHackathonYearFinalVote,
} from 'models/configs/hackathon/years/final-vote';
import {
  PrivateUserYearFinalJudge,
  getPrivateUserYearFinalJudge,
  docRef as privateUserYearFinalJudgeDocRef,
} from 'models/private/users/years/final-judges';
import {
  PrivateUserYearFinalVote,
  getPrivateUserYearFinalVote,
  docRef as privateUserYearFinalVoteDocRef,
} from 'models/private/users/years/final-votes';
import {
  getAllPublicResults,
  PublicResults,
} from 'models/public/years/results';

const CURRENT_YEAR = process.env.REACT_APP_CURRENT_YEAR;
if (!CURRENT_YEAR) {
  throw Error('REACT_APP_CURRENT_YEAR is not defined');
}

const FinalJudgeCreatePageComponent = () => {
  const { userId, yearId } = useParams();
  const [authUser] = useAuthState(auth);
  const [privateUser, setPrivateUser] = useState<
    PrivateUser | null | undefined
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
  const [privateUserYearFinalJudge, setPrivateUserYearFinalJudge] = useState<
    PrivateUserYearFinalJudge | null | undefined
  >(null);
  const [privateUserYearFinalVote, setPrivateUserYearFinalVote] = useState<
    PrivateUserYearFinalVote | null | undefined
  >(null);
  const [publicResults, setPublicResults] = useState<PublicResults | null | []>(
    null
  );
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
  const [configHackathonYearFinalJudge, setConfigHackathonYearFinalJudge] =
    useState<ConfigHackathonYearFinalJudge | null | undefined>(null);
  const [configHackathonYearFinalVote, setConfigHackathonYearFinalVote] =
    useState<ConfigHackathonYearFinalVote | null | undefined>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }
    if (authUser?.uid !== userId) {
      return;
    }
    getPrivateUser(userId)
      .then((privateUser) => {
        console.log({ privateUser });
        setPrivateUser(privateUser);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUser(undefined);
      });
    if (!yearId) {
      return;
    }
    getAllPrivateUserEntries(userId, yearId)
      .then((privateUserEntries) => {
        console.log({ privateUserEntries });
        setPrivateUserYearEntry(privateUserEntries[0]);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUserYearEntry(undefined);
      });
    getPrivateUserYearTeam(
      userId,
      yearId,
      userId /* Note: teamId should be userId */
    )
      .then((privateUserYearTeam) => {
        console.log({ privateUserYearTeam });
        setPrivateUserYearTeam(privateUserYearTeam);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUserYearTeam(undefined);
      });
    getPrivateUserYearSubmission(
      userId,
      yearId,
      userId /* Note: submissionId should be userId */
    )
      .then((privateUserYearSubmission) => {
        console.log({ privateUserYearSubmission });
        setPrivateUserYearSubmission(privateUserYearSubmission);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUserYearSubmission(undefined);
      });
    getPrivateUserYearJudge(userId, yearId, userId)
      .then((privateUserYearJudge) => {
        console.log({ privateUserYearJudge });
        setPrivateUserYearJudge(privateUserYearJudge);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUserYearJudge(undefined);
      });
    getPrivateUserYearVote(userId, yearId, userId)
      .then((privateUserYearVote) => {
        console.log({ privateUserYearVote });
        setPrivateUserYearVote(privateUserYearVote);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUserYearVote(undefined);
      });
    getPrivateUserYearFinalJudge(userId, yearId, userId)
      .then((privateUserYearFinalJudge) => {
        console.log({ privateUserYearFinalJudge });
        setPrivateUserYearFinalJudge(privateUserYearFinalJudge);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUserYearFinalJudge(undefined);
      });
    getPrivateUserYearFinalVote(userId, yearId, userId)
      .then((privateUserYearFinalVote) => {
        console.log({ privateUserYearFinalVote });
        setPrivateUserYearFinalVote(privateUserYearFinalVote);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUserYearFinalVote(undefined);
      });
    getConfigHackathonYearEntry(yearId)
      .then((configHackathonYearEntry) => {
        console.log({ configHackathonYearEntry });
        setConfigHackathonYearEntry(configHackathonYearEntry);
      })
      .catch((error) => {
        console.error(error);
        setConfigHackathonYearEntry(undefined);
      });
    getConfigHackathonYearTeam(yearId)
      .then((configHackathonYearTeam) => {
        console.log({ configHackathonYearTeam });
        setConfigHackathonYearTeam(configHackathonYearTeam);
      })
      .catch((error) => {
        console.error(error);
        setConfigHackathonYearTeam(undefined);
      });
    getConfigHackathonYearSubmission(yearId)
      .then((configHackathonYearSubmission) => {
        console.log({ configHackathonYearSubmission });
        setConfigHackathonYearSubmission(configHackathonYearSubmission);
      })
      .catch((error) => {
        console.error(error);
        setConfigHackathonYearSubmission(undefined);
      });
    getConfigHackathonYearJudge(yearId)
      .then((configHackathonYearJudge) => {
        console.log({ configHackathonYearJudge });
        setConfigHackathonYearJudge(configHackathonYearJudge);
      })
      .catch((error) => {
        console.error(error);
        setConfigHackathonYearJudge(undefined);
      });
    getConfigHackathonYearVote(yearId)
      .then((configHackathonYearVote) => {
        console.log({ configHackathonYearVote });
        setConfigHackathonYearVote(configHackathonYearVote);
      })
      .catch((error) => {
        console.error(error);
        setConfigHackathonYearVote(undefined);
      });
    getConfigHackathonYearFinalJudge(yearId)
      .then((configHackathonYearJudge) => {
        console.log({ configHackathonYearJudge });
        setConfigHackathonYearFinalJudge(configHackathonYearJudge);
      })
      .catch((error) => {
        console.error(error);
        setConfigHackathonYearFinalJudge(undefined);
      });
    getConfigHackathonYearFinalVote(yearId)
      .then((configHackathonYearFinalVote) => {
        console.log({ configHackathonYearFinalVote });
        setConfigHackathonYearFinalVote(configHackathonYearFinalVote);
      })
      .catch((error) => {
        console.error(error);
        setConfigHackathonYearFinalVote(undefined);
      });
    getAllPublicResults(yearId, 'createdTimeAsc')
      .then((publicResults) => {
        console.log({ publicResults });
        setPublicResults(publicResults);
      })
      .catch((error) => {
        console.error(error);
      });
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
          setPrivateUserYearTeam(undefined);
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
          setPrivateUserYearSubmission(undefined);
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
          setPrivateUserYearJudge(undefined);
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
          setPrivateUserYearVote(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserYearFinalJudgeDocListener = onSnapshot(
      privateUserYearFinalJudgeDocRef(userId, CURRENT_YEAR, userId),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setPrivateUserYearFinalJudge(data);
          }
        },
        error: (error) => {
          console.error(error);
          setPrivateUserYearFinalJudge(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribePrivateUserYearFinalVoteDocListener = onSnapshot(
      privateUserYearFinalVoteDocRef(userId, CURRENT_YEAR, userId),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setPrivateUserYearFinalVote(data);
          }
        },
        error: (error) => {
          console.error(error);
          setPrivateUserYearFinalVote(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearEntryDocListener = onSnapshot(
      configHackathonYearEntryDocRef(CURRENT_YEAR),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearEntry(data);
          }
        },
        error: (error) => {
          console.error(error);
          setConfigHackathonYearEntry(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearTeamDocListener = onSnapshot(
      configHackathonYearTeamDocRef(CURRENT_YEAR),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearTeam(data);
          }
        },
        error: (error) => {
          console.error(error);
          setConfigHackathonYearTeam(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearSubmissionDocListener = onSnapshot(
      configHackathonYearSubmissionDocRef(CURRENT_YEAR),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearSubmission(data);
          }
        },
        error: (error) => {
          console.error(error);
          setConfigHackathonYearSubmission(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearJudgeDocListener = onSnapshot(
      configHackathonYearJudgeDocRef(CURRENT_YEAR),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearJudge(data);
          }
        },
        error: (error) => {
          console.error(error);
          setConfigHackathonYearJudge(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearVoteDocListener = onSnapshot(
      configHackathonYearVoteDocRef(CURRENT_YEAR),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearVote(data);
          }
        },
        error: (error) => {
          console.error(error);
          setConfigHackathonYearVote(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearFinalJudgeDocListener = onSnapshot(
      configHackathonYearFinalJudgeDocRef(CURRENT_YEAR),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearFinalJudge(data);
          }
        },
        error: (error) => {
          console.error(error);
          setConfigHackathonYearFinalJudge(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );
    const unsubscribeConfigHackathonYearFinalVoteDocListener = onSnapshot(
      configHackathonYearFinalVoteDocRef(CURRENT_YEAR),
      {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setConfigHackathonYearFinalVote(data);
          }
        },
        error: (error) => {
          console.error(error);
          setConfigHackathonYearFinalVote(undefined);
        },
        complete: () => {
          console.log('complete');
        },
      }
    );

    return () => {
      unsubscribePrivateUserDocListener();
      unsubscribePrivateUserYearEntryDocListener();
      unsubscribePrivateUserYearTeamDocListener();
      unsubscribePrivateUserYearSubmissionDocListener();
      unsubscribePrivateUserYearJudgeDocListener();
      unsubscribePrivateUserYearVoteDocListener();
      unsubscribePrivateUserYearFinalJudgeDocListener();
      unsubscribePrivateUserYearFinalVoteDocListener();
      unsubscribeConfigHackathonYearEntryDocListener();
      unsubscribeConfigHackathonYearTeamDocListener();
      unsubscribeConfigHackathonYearSubmissionDocListener();
      unsubscribeConfigHackathonYearJudgeDocListener();
      unsubscribeConfigHackathonYearVoteDocListener();
      unsubscribeConfigHackathonYearFinalJudgeDocListener();
      unsubscribeConfigHackathonYearFinalVoteDocListener();
    };
  }, [
    userId,
    yearId,
    authUser,
    setPrivateUser,
    setPrivateUserYearEntry,
    setPrivateUserYearTeam,
    setPrivateUserYearSubmission,
    setPrivateUserYearJudge,
    setPrivateUserYearVote,
    setPrivateUserYearFinalJudge,
    setPrivateUserYearFinalVote,
    setPublicResults,
    setConfigHackathonYearEntry,
    setConfigHackathonYearTeam,
    setConfigHackathonYearSubmission,
    setConfigHackathonYearJudge,
    setConfigHackathonYearVote,
    setConfigHackathonYearFinalJudge,
    setConfigHackathonYearFinalVote,
  ]);

  return (
    <>
      {yearId &&
      authUser &&
      privateUser &&
      // privateUserYearEntry === undefined &&
      //   privateUserYearTeam === undefined &&
      privateUserYearSubmission === undefined &&
      privateUserYearJudge !== undefined &&
      privateUserYearFinalVote === undefined &&
      privateUserYearFinalJudge === undefined &&
      configHackathonYearEntry &&
      configHackathonYearTeam &&
      configHackathonYearSubmission &&
      configHackathonYearJudge &&
      configHackathonYearVote &&
      configHackathonYearFinalJudge &&
      configHackathonYearFinalVote &&
      publicResults ? (
        <PrivateUserYearFinalJudgeCreateFormWidgetComponent
          yearId={yearId}
          authUser={authUser}
          privateUser={privateUser}
          privateUserYearEntry={privateUserYearEntry}
          privateUserYearTeam={privateUserYearTeam}
          privateUserYearSubmission={privateUserYearSubmission}
          privateUserYearJudge={privateUserYearJudge}
          privateUserYearVote={privateUserYearVote}
          privateUserYearFinalJudge={privateUserYearFinalJudge}
          privateUserYearFinalVote={privateUserYearFinalVote}
          publicResults={publicResults}
          configHackathonYearEntry={configHackathonYearEntry}
          configHackathonYearTeam={configHackathonYearTeam}
          configHackathonYearSubmission={configHackathonYearSubmission}
          configHackathonYearJudge={configHackathonYearJudge}
          configHackathonYearVote={configHackathonYearVote}
          configHackathonYearFinalJudge={configHackathonYearFinalJudge}
          configHackathonYearFinalVote={configHackathonYearFinalVote}
        />
      ) : (
        <progress className="progress"></progress>
      )}
    </>
  );
};

export default FinalJudgeCreatePageComponent;
