import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPrivateUser, PrivateUser } from 'models/private/users';
import { getAllPrivateUserTxs, PrivateUserTxs } from 'models/private/users/txs';
import PrivateUserCardWidgetComponent from 'components/widgets/card/PrivateUserCard';
import PrivateUserTxsTableCardWidgetComponent from 'components/widgets/card/PrivateUserTxsTableCard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'utils/firebase';
import {
  getAllPrivateUserEntries,
  PrivateUserYearEntry,
} from 'models/private/users/years/entries';
import PrivateUserYearEntryCardWidgetComponent from 'components/widgets/card/PrivateUserEntryCard';
import PrivateUserYearEntryFormWidgetComponent from 'components/widgets/form/PrivateUserEntryForm';

const UserPageComponent = () => {
  const { userId } = useParams();
  const [authUser] = useAuthState(auth);
  const [privateUser, setPrivateUser] = useState<
    PrivateUser | null | undefined
  >(null);
  const [privateUserTxs, setPrivateUserTxs] = useState<
    PrivateUserTxs | null | undefined
  >(null);
  const [privateUserEntry, setPrivateUserEntry] = useState<
    PrivateUserYearEntry | null | undefined
  >(null);

  useEffect(() => {
    console.log({ userId, authUser });
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
    getAllPrivateUserTxs(userId)
      .then((privateUserTxs) => {
        setPrivateUserTxs(privateUserTxs);
      })
      .catch((error) => {
        console.error(error);
      });
    getAllPrivateUserEntries(userId, '2023')
      .then((privateUserEntries) => {
        setPrivateUserEntry(privateUserEntries[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [
    userId,
    authUser,
    setPrivateUser,
    setPrivateUserTxs,
    setPrivateUserEntry,
  ]);

  return (
    <>
      {privateUser ? <PrivateUserCardWidgetComponent {...privateUser} /> : null}
      {privateUser?.id && privateUserEntry === undefined ? (
        <PrivateUserYearEntryFormWidgetComponent
          privateUser={privateUser}
          yearId="2023"
        />
      ) : null}
      {privateUserEntry ? (
        <PrivateUserYearEntryCardWidgetComponent {...privateUserEntry} />
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
