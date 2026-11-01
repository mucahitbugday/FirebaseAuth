import { useEffect, useMemo, useState } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthActions, RootStackParamList } from './type';

const googleWebClientId =
  '1042236754290-8a14k9fovaefcbjqoqpu4dbbjbv52e6e.apps.googleusercontent.com';

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    if (error.code === '10' || error.code === 'DEVELOPER_ERROR') {
      return 'Google Sign-In yapılandırma hatası. Firebase Console’da Android uygulama imza SHA-1/SHA-256 değerlerini ve OAuth istemcilerini kontrol edin.';
    }
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return 'Google ile giriş yapılamadı. Lütfen tekrar deneyin.';
}

function isSignInCancelled(error: unknown) {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  return (
    error.code === 'SIGN_IN_CANCELLED' ||
    error.code === '12501' ||
    error.code === 'ERROR_CANCELED'
  );
}

export function useAuthActions(): AuthActions {
  const auth = useMemo(() => getAuth(), []);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    GoogleSignin.configure({ webClientId: googleWebClientId });
  }, []);

  const handleGoogleSignIn = async () => {
    setIsBusy(true);
    setError('');

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        return;
      }

      if (!response.data.idToken) {
        throw new Error(
          'Google oturum açma işlemi bir kimlik belirteci döndürmedi.',
        );
      }

      await signInWithCredential(
        auth,
        GoogleAuthProvider.credential(response.data.idToken),
      );
      navigation.goBack();
    } catch (signInError) {
      if (!isSignInCancelled(signInError)) {
        setError(getErrorMessage(signInError));
      }
    } finally {
      setIsBusy(false);
    }
  };

  return {
    isBusy,
    error,
    handleBack: () => navigation.goBack(),
    handleGoogleSignIn,
  };
}
