// Todo: Team
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
import PrivateUserCardWidgetComponent from 'components/widgets/card/PrivateUserCard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, onSnapshot } from 'utils/firebase';
import {
  docRef as privateUserYearEntryDocRef,
  getAllPrivateUserEntries,
  PrivateUserYearEntry,
} from 'models/private/users/years/entries';

const TeamCreatePageComponent = () => {
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

    return () => {
      unsubscribePrivateUserDocListener();
      unsubscribePrivateUserYearEntryDocListener();
    };
  }, [userId, authUser, setPrivateUser, setPrivateUserYearEntry]);

  return (
    <>
      {privateUser && privateUserYearEntry ? (
        <PrivateUserCardWidgetComponent {...privateUser} />
      ) : null}
    </>
  );
};

export default TeamCreatePageComponent;
