import { auth, signInWithGooglePopup } from 'utils/firebase';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

const SignInWithGooglePopupButton = () => {
  const navigate = useNavigate();
  const [authUser, authUserLoading] = useAuthState(auth);

  const handleSignInWithGooglePopup = async () => {
    await signInWithGooglePopup();
  };

  useEffect(() => {
    if (!authUserLoading && authUser) {
      navigate(`/private/users/${authUser.uid}`);
    }
  }, [authUser, authUserLoading, navigate]);

  return (
    <button
      className="btn border-hidden outline-0 bg-cyan-500 w-64 m-2"
      onClick={handleSignInWithGooglePopup}
    >
      <FaGoogle className="inline-block mr-2" /> Sign in with Google
    </button>
  );
};

export default SignInWithGooglePopupButton;
