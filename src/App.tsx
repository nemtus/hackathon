import { BrowserRouter, Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import './App.css';
import AppHeader from 'components/widgets/app-header';

const HomePageComponent = loadable(() => import('components/pages/home'));
const UserPageComponent = loadable(
  () => import('components/pages/users/[userId]')
);
const TeamCreatePageComponent = loadable(
  () => import('components/pages/users/[userId]/years/[yearId]/teams/create')
);
const SubmissionCreatePageComponent = loadable(
  () =>
    import('components/pages/users/[userId]/years/[yearId]/submissions/create')
);

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomePageComponent />} />
        <Route path="/private/users/:userId" element={<UserPageComponent />} />
        <Route
          path="/private/users/:userId/years/:yearId/teams/create"
          element={<TeamCreatePageComponent />}
        />
        <Route
          path="/private/users/:userId/years/:yearId/submissions/create"
          element={<SubmissionCreatePageComponent />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
