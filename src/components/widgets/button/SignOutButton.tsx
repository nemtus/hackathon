import { signOut } from 'utils/firebase';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <button
      className="btn btn-ghost border-hidden outline-0 m-2"
      onClick={handleSignOut}
    >
      <FaSignOutAlt className="inline-block mr-2" />
      Sign out
    </button>
  );
};

export default SignOutButton;
