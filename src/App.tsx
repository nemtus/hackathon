import { BrowserRouter, Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import './App.css';
import AppHeader from 'components/widgets/app-header';
import JudgeCreatePageComponent from 'components/pages/users/[userId]/years/[yearId]/judges/create';

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
const PublicResultPageComponent = loadable(
  () => import('components/pages/years/[yearId]/results/[resultId]')
);
const PublicResultsPageComponent = loadable(
  () => import('components/pages/years/[yearId]/results')
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
        <Route
          path="/private/users/:userId/years/:yearId/judges/create"
          element={<JudgeCreatePageComponent />}
        />
        <Route
          path="/private/users/:userId/years/:yearId/votes/:voteId/update"
          element={null}
        />
        <Route
          path="/private/users/:userId/years/:yearId/votes/create"
          element={null}
        />
        <Route
          path="/private/users/:userId/years/:yearId/votes/:voteId/update"
          element={null}
        />
        <Route
          path="/years/:yearId/results/:resultId"
          element={<PublicResultPageComponent />}
        />
        <Route
          path="/years/:yearId/results"
          element={<PublicResultsPageComponent />}
        />
        <Route path="/years/:yearId/judges/:judgeId" element={null} />
        <Route path="/years/:yearId/judges" element={null} />
        <Route path="/years/:yearId/votes/:voteId" element={null} />
        <Route path="/years/:yearId/votes" element={null} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
