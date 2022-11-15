// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  signInWithPopup,
  linkWithPopup,
  unlink,
  signOut as baseSignOut,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider, // Note: Yahoo, Microsoft and Apple
} from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, 'asia-northeast1');
const analytics = getAnalytics(app);

// Note: Auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const githubProvider = new GithubAuthProvider();
const yahooProvider = new OAuthProvider('yahoo.com');
const microsoftProvider = new OAuthProvider('microsoft.com');
const appleProvider = new OAuthProvider('apple.com');

// Note: Auth supported providers list
type SupportedProviderName =
  | 'google'
  | 'facebook'
  | 'twitter'
  | 'github'
  | 'yahoo'
  | 'microsoft'
  | 'apple';
const supportedProviderNames: SupportedProviderName[] = [
  'google',
  'facebook',
  'twitter',
  'github',
  'yahoo',
  'microsoft',
  'apple',
];

// Note: Convert providerName to Auth provider
const convertProviderNameToAuthProvider = (providerName: string) => {
  console.log(providerName);
  switch (providerName) {
    case 'google':
      return googleProvider;
    case 'facebook':
      return facebookProvider;
    case 'twitter':
      return twitterProvider;
    case 'github':
      return githubProvider;
    case 'yahoo':
      return yahooProvider;
    case 'microsoft':
      return microsoftProvider;
    case 'apple':
      return appleProvider;
    default:
      return null;
  }
};

// Note: Auth error handler
const authErrorHandler = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  signInProviderName: string
): Promise<void> => {
  if (error.code === 'auth/account-exists-with-different-credential') {
    console.log('another auth process handling...');
    for (let index = 0; index < supportedProviderNames.length; index++) {
      const providerName = supportedProviderNames[index];
      console.log({ providerName });
      const provider = convertProviderNameToAuthProvider(providerName);
      try {
        if (!provider) {
          throw Error('No provider found for providerName');
        }
        const signInResult = await signInWithPopup(auth, provider);
        if (!signInResult.user) {
          throw Error('Not authenticated');
        }
        if (!signInResult.user.emailVerified) {
          throw Error('Email not verified');
        }
        const signInProvider =
          convertProviderNameToAuthProvider(signInProviderName);
        if (!signInProvider) {
          throw Error('No provider found for signInProviderName');
        }
        const linkResult = await linkWithPopup(
          signInResult.user,
          signInProvider
        );
        if (!linkResult.user) {
          throw Error('Account link failed');
        }
        if (!linkResult.user.emailVerified) {
          await unlink(linkResult.user, signInProvider.providerId);
          throw Error('Email not verified');
        }
        return;
      } catch (error) {
        console.log(providerName);
        console.log(error);
      }
    }
    throw Error('Authentication failed');
  }
};

// Note: Auth sign in with popup methods
const signInWithGooglePopup = async () => {
  try {
    const signInResult = await signInWithPopup(auth, googleProvider);
    if (!signInResult.user) {
      throw Error('Not authenticated');
    }
    if (!signInResult.user.emailVerified) {
      throw Error('Email not verified');
    }
  } catch (error) {
    console.error(error);
    await authErrorHandler(error, 'google');
  }
};
const signInWithFacebookPopup = async () => {
  try {
    const signInResult = await signInWithPopup(auth, facebookProvider);
    if (!signInResult.user) {
      throw Error('Not authenticated');
    }
    if (!signInResult.user.emailVerified) {
      throw Error('Email not verified');
    }
  } catch (error) {
    console.error(error);
    await authErrorHandler(error, 'facebook');
  }
};
const signInWithTwitterPopup = async () => {
  try {
    const signInResult = await signInWithPopup(auth, twitterProvider);
    if (!signInResult.user) {
      throw Error('Not authenticated');
    }
    if (!signInResult.user.emailVerified) {
      throw Error('Email not verified');
    }
  } catch (error) {
    console.error(error);
    await authErrorHandler(error, 'twitter');
  }
};
const signInWithGithubPopup = async () => {
  try {
    const signInResult = await signInWithPopup(auth, githubProvider);
    if (!signInResult.user) {
      throw Error('Not authenticated');
    }
    if (!signInResult.user.emailVerified) {
      throw Error('Email not verified');
    }
  } catch (error) {
    console.error(error);
    await authErrorHandler(error, 'github');
  }
};
const signInWithYahooPopup = async () => {
  try {
    const signInResult = await signInWithPopup(auth, yahooProvider);
    if (!signInResult.user) {
      throw Error('Not authenticated');
    }
    if (!signInResult.user.emailVerified) {
      throw Error('Email not verified');
    }
  } catch (error) {
    console.error(error);
    await authErrorHandler(error, 'yahoo');
  }
};
const signInWithMicrosoftPopup = async () => {
  try {
    const signInResult = await signInWithPopup(auth, microsoftProvider);
    if (!signInResult.user) {
      throw Error('Not authenticated');
    }
    if (!signInResult.user.emailVerified) {
      throw Error('Email not verified');
    }
  } catch (error) {
    console.error(error);
    await authErrorHandler(error, 'microsoft');
  }
};
const signInWithApplePopup = async () => {
  try {
    const signInResult = await signInWithPopup(auth, appleProvider);
    if (!signInResult.user) {
      throw Error('Not authenticated');
    }
    if (!signInResult.user.emailVerified) {
      throw Error('Email not verified');
    }
  } catch (error) {
    console.error(error);
    await authErrorHandler(error, 'apple');
  }
};
const signOut = () => baseSignOut(auth);

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export {
  auth,
  storage,
  functions,
  analytics,
  signInWithPopup,
  signOut,
  fetchSignInMethodsForEmail,
  googleProvider,
  facebookProvider,
  twitterProvider,
  githubProvider,
  yahooProvider,
  microsoftProvider,
  appleProvider,
  signInWithGooglePopup,
  signInWithFacebookPopup,
  signInWithTwitterPopup,
  signInWithGithubPopup,
  signInWithYahooPopup,
  signInWithMicrosoftPopup,
  signInWithApplePopup,
};
export default db;
