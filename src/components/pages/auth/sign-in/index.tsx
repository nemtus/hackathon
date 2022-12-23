import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from 'utils/firebase';
import SignInWithGooglePopupButton from 'components/widgets/button/SignInWithGooglePopupButton';
import SignInWithTwitterPopupButton from 'components/widgets/button/SignInWithTwitterPopupButton';
import SignInWithGithubPopupButton from 'components/widgets/button/SignInWithGithubPopupButton';

// Note: Currently not supported.
// import SignInWithFacebookPopupButton from 'components/widgets/button/SignInWithFacebookPopupButton';
// import SignInWithMicrosoftPopupButton from 'components/widgets/button/SignInWithMicrosoftPopupButton';
// import SignInWithYahooPopupButton from 'components/widgets/button/SignInWithYahooPopupButton';
// import SignInWithApplePopupButton from 'components/widgets/button/SignInWithApplePopupButton';

const AuthSignInPageComponent = () => {
  const navigate = useNavigate();
  const [authUser] = useAuthState(auth);

  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser]);

  return (
    <div className="hero">
      <div className="hero-content text-center">
        <div className="max-w-5xl">
          <h2 className="text-5xl font-bold">{"Let's Sign in"}</h2>
          <p className="py-6">
            You need to sign in with your Google, Twitter or GitHub account to
            join this hackathon.
          </p>
          <div>
            <SignInWithGooglePopupButton />
            <SignInWithTwitterPopupButton />
            <SignInWithGithubPopupButton />
            {/* Note: Currently not supported. */}
            {/* <SignInWithFacebookPopupButton /> */}
            {/* <SignInWithMicrosoftPopupButton /> */}
            {/* <SignInWithYahooPopupButton /> */}
            {/* <SignInWithApplePopupButton /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSignInPageComponent;
