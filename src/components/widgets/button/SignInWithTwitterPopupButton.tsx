import { signInWithTwitterPopup } from 'utils/firebase';
import { FaTwitter } from 'react-icons/fa';

const SignInWithTwitterPopupButton = () => {
  const handleSignInWithTwitterPopup = async () => {
    await signInWithTwitterPopup();
  };

  return (
    <button
      className="btn border-hidden outline-0 bg-sky-500 w-64 m-2"
      onClick={handleSignInWithTwitterPopup}
    >
      <FaTwitter className="inline-block mr-2" /> Sign in with Twitter
    </button>
  );
};

export default SignInWithTwitterPopupButton;
