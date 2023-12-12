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
import {
  docRef as privateUserYearSubmissionDocRef,
  getPrivateUserYearSubmission,
  PrivateUserYearSubmission,
} from 'models/private/users/years/submissions';
import PrivateUserYearSubmissionCreateFormWidgetComponent from 'components/widgets/form/PrivateUserSubmissionCreateForm';

const CURRENT_YEAR = process.env.REACT_APP_CURRENT_YEAR;
if (!CURRENT_YEAR) {
  throw Error('REACT_APP_CURRENT_YEAR is not defined');
}

const SubmissionCreatePageComponent = () => {
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

  useEffect(() => {
    if (!userId) {
      return;
    }
    if (authUser?.uid !== userId) {
      return;
    }
    getPrivateUser(userId)
      .then((privateUser) => {
        setPrivateUser(privateUser);
      })
      .catch((error) => {
        console.error(error);
      });
    if (!yearId) {
      return;
    }
    getAllPrivateUserEntries(userId, yearId)
      .then((privateUserEntries) => {
        setPrivateUserYearEntry(privateUserEntries[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    getPrivateUserYearTeam(
      userId,
      yearId,
      userId /* Note: teamId should be userId */
    )
      .then((privateUserYearTeam) => {
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
        setPrivateUserYearSubmission(privateUserYearSubmission);
      })
      .catch((error) => {
        console.error(error);
        setPrivateUserYearSubmission(undefined);
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

    return () => {
      unsubscribePrivateUserDocListener();
      unsubscribePrivateUserYearEntryDocListener();
      unsubscribePrivateUserYearTeamDocListener();
      unsubscribePrivateUserYearSubmissionDocListener();
    };
  }, [
    userId,
    yearId,
    authUser,
    setPrivateUser,
    setPrivateUserYearEntry,
    setPrivateUserYearTeam,
    setPrivateUserYearSubmission,
  ]);

  return (
    <>
      {privateUser &&
      privateUserYearEntry &&
      yearId &&
      privateUserYearTeam &&
      privateUserYearSubmission === undefined ? (
        <PrivateUserYearSubmissionCreateFormWidgetComponent
          privateUser={privateUser}
          privateUserYearTeam={privateUserYearTeam}
          yearId={yearId}
        />
      ) : null}
    </>
  );
};

export default SubmissionCreatePageComponent;
