import { BrowserRouter, Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import './App.css';
import AppHeader from 'components/widgets/app-header';

const HomePageComponent = loadable(() => import('components/pages/home'));
const UserPageComponent = loadable(
  () => import('components/pages/users/[userId]')
);

function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomePageComponent />} />
        <Route path="/private/users/:userId" element={<UserPageComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
