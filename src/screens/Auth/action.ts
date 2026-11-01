import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import {
  getAuth,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  OAuthProvider,
  sendSignInLinkToEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  type ConfirmationResult,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import googleServicesConfig from '../../../android/app/google-services.json';
import type {
  AuthActions,
  OAuthSignInProvider,
  RootStackParamList,
} from './type';

const googleWebClientId =
  '1042236754290-8a14k9fovaefcbjqoqpu4dbbjbv52e6e.apps.googleusercontent.com';
const firebaseLinkDomain = `${googleServicesConfig.project_info.project_id}.firebaseapp.com`;

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const messages: Record<string, string> = {
      '10':
        'Google Sign-In yapılandırma hatası. Firebase Console’da Android uygulama imza SHA-1/SHA-256 değerlerini ve OAuth istemcilerini kontrol edin.',
      DEVELOPER_ERROR:
        'Google Sign-In yapılandırma hatası. Firebase Console’da Android uygulama imza SHA-1/SHA-256 değerlerini ve OAuth istemcilerini kontrol edin.',
      'auth/account-exists-with-different-credential':
        'Bu e-posta farklı bir giriş yöntemiyle kayıtlı.',
      'auth/invalid-action-code':
        'E-posta giriş bağlantısının süresi dolmuş veya daha önce kullanılmış.',
      'auth/invalid-credential': 'E-posta veya şifre hatalı.',
      'auth/invalid-email': 'Geçerli bir e-posta adresi girin.',
      'auth/invalid-phone-number':
        'Telefon numarasını ülke koduyla birlikte girin. Örnek: +905551234567',
      'auth/invalid-verification-code': 'SMS doğrulama kodu hatalı.',
      'auth/missing-client-identifier':
        'Bu giriş yöntemi Firebase Console’da etkinleştirilmemiş.',
      'auth/operation-not-allowed':
        'Bu giriş yöntemi Firebase Console’da etkinleştirilmemiş.',
      'auth/too-many-requests':
        'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.',
      'auth/unauthorized-domain':
        'E-posta bağlantısı için Firebase Console’daki yetkili alan adlarını kontrol edin.',
      'auth/user-not-found': 'Bu e-posta ile kayıtlı bir hesap bulunamadı.',
      'auth/wrong-password': 'E-posta veya şifre hatalı.',
    };
    const code = error.code;

    if (typeof code === 'string' && messages[code]) {
      return messages[code];
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

  return 'İşlem tamamlanamadı. Lütfen tekrar deneyin.';
}

function isSignInCancelled(error: unknown) {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  return (
    error.code === 'SIGN_IN_CANCELLED' ||
    error.code === '12501' ||
    error.code === 'auth/cancelled-popup-request' ||
    error.code === 'ERROR_CANCELED'
  );
}

export function useAuthActions(): AuthActions {
  const auth = useMemo(() => getAuth(), []);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneConfirmation, setPhoneConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [pendingEmailLink, setPendingEmailLink] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    GoogleSignin.configure({ webClientId: googleWebClientId });
  }, []);

  const finishSignIn = () => navigation.goBack();

  const handleIncomingEmailLink = useCallback(
    (url: string | null) => {
      if (url && isSignInWithEmailLink(auth, url)) {
        setPendingEmailLink(url);
        setError('');
        setMessage(
          'Giriş bağlantısı açıldı. Devam etmek için e-posta adresinizi onaylayın.',
        );
      }
    },
    [auth],
  );

  useEffect(() => {
    let isMounted = true;
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleIncomingEmailLink(url);
    });

    Linking.getInitialURL()
      .then(url => {
        if (isMounted && url) {
          handleIncomingEmailLink(url);
        }
      })
      .catch(linkError => {
        setError(getErrorMessage(linkError));
      });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [handleIncomingEmailLink]);

  const runOAuthSignIn = async (providerId: OAuthSignInProvider) => {
    setIsBusy(true);
    setError('');

    try {
      const provider = new OAuthProvider(providerId);
      if (providerId === 'apple.com') {
        provider.addScope('email');
        provider.addScope('name');
      } else if (providerId === 'facebook.com') {
        provider.addScope('email');
      } else if (providerId === 'microsoft.com') {
        provider.addScope('email');
        provider.setCustomParameters({ prompt: 'select_account' });
      }

      const nativeProvider = {
        providerId,
        toObject: () => provider.toObject(),
      };
      await signInWithPopup(auth, nativeProvider);
      finishSignIn();
    } catch (signInError) {
      if (!isSignInCancelled(signInError)) {
        setError(getErrorMessage(signInError));
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleEmailPasswordSignIn = async () => {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }
    if (!password) {
      setError('Şifrenizi girin.');
      return;
    }

    setIsBusy(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      finishSignIn();
    } catch (signInError) {
      setError(getErrorMessage(signInError));
    } finally {
      setIsBusy(false);
    }
  };

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
      finishSignIn();
    } catch (signInError) {
      if (!isSignInCancelled(signInError)) {
        setError(getErrorMessage(signInError));
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendPhoneCode = async () => {
    const normalizedPhoneNumber = phoneNumber.trim();
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhoneNumber)) {
      setError(
        'Telefon numarasını ülke koduyla birlikte girin. Örnek: +905551234567',
      );
      return;
    }

    setIsBusy(true);
    setError('');
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        normalizedPhoneNumber,
      );
      setPhoneConfirmation(confirmation);
      setVerificationCode('');
      setMessage('SMS doğrulama kodu gönderildi.');
    } catch (phoneError) {
      setError(getErrorMessage(phoneError));
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirmPhoneCode = async () => {
    if (!phoneConfirmation) {
      setError('Önce telefonunuza doğrulama kodu gönderin.');
      return;
    }
    if (!/^\d{6}$/.test(verificationCode.trim())) {
      setError('6 haneli SMS doğrulama kodunu girin.');
      return;
    }

    setIsBusy(true);
    setError('');
    try {
      await phoneConfirmation.confirm(verificationCode.trim());
      setPhoneConfirmation(null);
      finishSignIn();
    } catch (phoneError) {
      setError(getErrorMessage(phoneError));
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendEmailLink = async () => {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Geçerli bir e-posta adresi girin.');
      return;
    }

    setIsBusy(true);
    setError('');
    try {
      await sendSignInLinkToEmail(auth, normalizedEmail, {
        url: `https://${firebaseLinkDomain}`,
        handleCodeInApp: true,
        android: {
          packageName: 'com.firebaseauth',
          installApp: true,
          minimumVersion: '1',
        },
        iOS: {
          bundleId: 'org.reactjs.native.example.FirebaseAuth',
        },
      });
      setMessage('Giriş bağlantısı e-posta adresinize gönderildi.');
    } catch (linkError) {
      setError(getErrorMessage(linkError));
    } finally {
      setIsBusy(false);
    }
  };

  const handleCompleteEmailLinkSignIn = async () => {
    const normalizedEmail = email.trim();
    if (!pendingEmailLink || !isSignInWithEmailLink(auth, pendingEmailLink)) {
      setError('Geçerli bir e-posta giriş bağlantısı bulunamadı.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Bağlantının gönderildiği e-posta adresini girin.');
      return;
    }

    setIsBusy(true);
    setError('');
    try {
      await signInWithEmailLink(auth, normalizedEmail, pendingEmailLink);
      setPendingEmailLink(null);
      finishSignIn();
    } catch (linkError) {
      setError(getErrorMessage(linkError));
    } finally {
      setIsBusy(false);
    }
  };

  return {
    email,
    password,
    phoneNumber,
    verificationCode,
    isPhoneCodeSent: phoneConfirmation !== null,
    isEmailLinkPending: pendingEmailLink !== null,
    isBusy,
    error,
    message,
    setEmail,
    setPassword,
    setPhoneNumber,
    setVerificationCode,
    handleBack: () => navigation.goBack(),
    handleEmailPasswordSignIn,
    handleGoogleSignIn,
    handleAppleSignIn: () => runOAuthSignIn('apple.com'),
    handleFacebookSignIn: () => runOAuthSignIn('facebook.com'),
    handleTwitterSignIn: () => runOAuthSignIn('twitter.com'),
    handleMicrosoftSignIn: () => runOAuthSignIn('microsoft.com'),
    handleSendPhoneCode,
    handleConfirmPhoneCode,
    handleSendEmailLink,
    handleCompleteEmailLinkSignIn,
    dismissMessage: () => setMessage(''),
  };
}
