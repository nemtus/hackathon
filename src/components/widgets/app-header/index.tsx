import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'utils/firebase';
import {
  FaBars,
  FaHome,
  // FaFile,
  FaUser,
  FaUserCog,
  FaSignInAlt,
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import SignOutButton from 'components/widgets/button/SignOutButton';
import SymbolBlockchainLogo from 'images/symbol-logo-primary-light-bg-01.png';

interface AppMenu {
  key: string;
  icon: IconType;
  label: string;
  link: string;
}
const appMenuList: AppMenu[] = [
  {
    key: 'home',
    icon: FaHome,
    label: 'Home',
    link: '/',
  },
];
// const appMenuListAuthOnly = (userId: string): AppMenu[] => {
//   return [
//     {
//       key: 'files',
//       icon: FaFile,
//       label: 'Files',
//       link: `/users/${userId}/files`,
//     },
//   ];
// };

interface UserMenu {
  key: string;
  icon: IconType;
  label: string;
  link: string;
}
const userMenuListAuthOnly = (userId: string): UserMenu[] => {
  return [
    {
      key: 'user',
      icon: FaUserCog,
      label: 'User Settings',
      link: `/private/users/${userId}`,
    },
  ];
};

const AppHeader = () => {
  const [authUser, authUserLoading] = useAuthState(auth);

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost">
              <FaBars />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content shadow bg-base-100 rounded-box w-52"
            >
              {appMenuList.map((appMenu) => (
                <li key={appMenu.key}>
                  <a href={appMenu.link}>
                    <appMenu.icon />
                    {appMenu.label}
                  </a>
                </li>
              ))}
              {/* {authUser
                ? appMenuListAuthOnly(authUser.uid).map((appMenu) => (
                    <li key={appMenu.key}>
                      <a href={appMenu.link}>
                        <appMenu.icon />
                        {appMenu.label}
                      </a>
                    </li>
                  ))
                : null} */}
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-xl" href="/">
            <img
              className="w-5 h-5 mt-1 mr-2"
              src={SymbolBlockchainLogo}
              alt="Symbol Blockchain Logo"
            />
            NEMTUS Hack+
          </a>
        </div>
        <div className="navbar-end">
          <div className="dropdown flex justify-end">
            {authUser ? (
              <>
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <FaUser />
                </label>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content shadow bg-base-100 rounded-box w-52"
                >
                  {userMenuListAuthOnly(authUser.uid).map((userMenu) => (
                    <li key={userMenu.key}>
                      <a href={userMenu.link}>
                        <userMenu.icon />
                        {userMenu.label}
                      </a>
                    </li>
                  ))}
                  <div className="divider"></div>
                  <li>
                    <SignOutButton />
                  </li>
                </ul>
              </>
            ) : (
              <a href="/auth/sign-in">
                <FaSignInAlt className="inline-block mr-2" />
                Sign in
              </a>
            )}
          </div>
        </div>
      </div>
      {authUserLoading ? <progress className="progress"></progress> : null}
    </>
  );
};

export default AppHeader;
