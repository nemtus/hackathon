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
const JudgeCreatePageComponent = loadable(
  () => import('components/pages/users/[userId]/years/[yearId]/judges/create')
);
const VoteCreatePageComponent = loadable(
  () => import('components/pages/users/[userId]/years/[yearId]/votes/create')
);
const FinalJudgeCreatePageComponent = loadable(
  () =>
    import('components/pages/users/[userId]/years/[yearId]/final-judges/create')
);
const FinalVoteCreatePageComponent = loadable(
  () =>
    import('components/pages/users/[userId]/years/[yearId]/final-votes/create')
);
const PublicResultPageComponent = loadable(
  () => import('components/pages/years/[yearId]/results/[resultId]')
);
const PublicResultsPageComponent = loadable(
  () => import('components/pages/years/[yearId]/results')
);
const PublicAwardPageComponent = loadable(
  () => import('components/pages/years/[yearId]/awards/[awardId]')
);
const PublicAwardsPageComponent = loadable(
  () => import('components/pages/years/[yearId]/awards')
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
          path="/private/users/:userId/years/:yearId/votes/create"
          element={<VoteCreatePageComponent />}
        />
        <Route
          path="/private/users/:userId/years/:yearId/final-judges/create"
          element={<FinalJudgeCreatePageComponent />}
        />
        <Route
          path="/private/users/:userId/years/:yearId/final-votes/create"
          element={<FinalVoteCreatePageComponent />}
        />
        <Route
          path="/years/:yearId/results/:resultId"
          element={<PublicResultPageComponent />}
        />
        <Route
          path="/years/:yearId/results"
          element={<PublicResultsPageComponent />}
        />
        <Route
          path="/years/:yearId/awards/:awardId"
          element={<PublicAwardPageComponent />}
        />
        <Route
          path="/years/:yearId/awards"
          element={<PublicAwardsPageComponent />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
