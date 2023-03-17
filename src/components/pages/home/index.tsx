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

const HomePageComponent = () => {
  const [authUser, authUserLoading] = useAuthState(auth);
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

  useEffect(() => {
    if (!authUser) {
      return;
    }
    const userId = authUser.uid;
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

    return () => {
      unsubscribePrivateUserDocListener();
      unsubscribePrivateUserTxsCollectionListener();
      unsubscribePrivateUserYearEntryDocListener();
      unsubscribePrivateUserYearTeamDocListener();
      unsubscribePrivateUserYearSubmissionDocListener();
    };
  }, [
    authUser,
    setPrivateUser,
    setPrivateUserTxs,
    setPrivateUserYearEntry,
    setPrivateUserYearTeam,
    setPrivateUserYearSubmission,
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
          privateUser={privateUser}
          privateUserTxs={privateUserTxs}
          privateUserYearEntry={privateUserYearEntry}
          privateUserYearTeam={privateUserYearTeam}
          privateUserYearSubmission={privateUserYearSubmission}
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
