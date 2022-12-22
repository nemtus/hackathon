import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'utils/firebase';
import AuthSignInPageComponent from 'components/pages/auth/sign-in';
import { useEffect, useState } from 'react';
import { getPrivateUser, PrivateUser } from 'models/private/users';
import {
  getAllPrivateUserEntries,
  PrivateUserYearEntry,
} from 'models/private/users/years/entries';
import PrivateUserYearEntryFormWidgetComponent from 'components/widgets/form/PrivateUserEntryForm';

const HomePageComponent = () => {
  const [authUser, authUserLoading] = useAuthState(auth);
  const [privateUser, setPrivateUser] = useState<
    PrivateUser | null | undefined
  >(null);
  const [privateUserYearEntry, setPrivateUserYearEntry] = useState<
    PrivateUserYearEntry | null | undefined
  >(null);

  useEffect(() => {
    if (!authUser) {
      return;
    }
    const userId = authUser.uid;
    getPrivateUser(userId).then((privateUser) => {
      setPrivateUser(privateUser);
    });
    getAllPrivateUserEntries(userId, '2023').then((privateUserYearEntries) => {
      setPrivateUserYearEntry(privateUserYearEntries[0]);
    });
  }, [authUser, setPrivateUser, setPrivateUserYearEntry]);

  return (
    <>
      {!authUser && !authUserLoading ? <AuthSignInPageComponent /> : null}

      {authUser && privateUser && privateUserYearEntry === undefined ? (
        <PrivateUserYearEntryFormWidgetComponent
          privateUser={privateUser}
          yearId="2023"
        />
      ) : null}
    </>
  );
};

export default HomePageComponent;
