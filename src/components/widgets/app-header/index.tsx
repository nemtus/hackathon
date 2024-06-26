import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'utils/firebase';
import {
  FaBars,
  FaHome,
  // FaFile,
  FaList,
  FaAward,
  FaUser,
  FaUserCog,
  // FaSignInAlt,
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import SignOutButton from 'components/widgets/button/SignOutButton';
import NemtusLogo from 'images/nemtus-logo.png';

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
  {
    key: '2024-entry-list',
    icon: FaList,
    label: '2024 Entry List',
    link: '/years/2024/results',
  },
  {
    key: '2024-award-list',
    icon: FaAward,
    label: '2024 Award List',
    link: '/years/2024/awards',
  },
  {
    key: '2023-entry-list',
    icon: FaList,
    label: '2023 Entry List',
    link: '/years/2023/results',
  },
  {
    key: '2023-award-list',
    icon: FaAward,
    label: '2023 Award List',
    link: '/years/2023/awards',
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
              src={NemtusLogo}
              alt="NEMTUS Logo"
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
            ) : null}
            {/* <a href="/auth/sign-in">
                <FaSignInAlt className="inline-block mr-2" />
                Sign in
              </a> */}
          </div>
        </div>
      </div>
      {authUserLoading ? <progress className="progress"></progress> : null}
    </>
  );
};

export default AppHeader;
