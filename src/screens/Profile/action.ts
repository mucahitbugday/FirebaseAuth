import { createElement, useEffect, useMemo, useState } from 'react';
import { Linking, useColorScheme } from 'react-native';
import {
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  type User,
} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { Icon, MD3DarkTheme, MD3LightTheme, Switch, Text, } from 'react-native-paper';
import type { ListItemProps } from 'react-native-paper';
import { View } from 'react-native';
import googleServicesConfig from '../../../android/app/google-services.json';
import { styles } from './style';
import type {
  FirebaseGoogleServicesConfig,
  ProfileActions,
  ProfileDialog,
  ThemePreference,
} from './type';

const firebaseGoogleServices =
  googleServicesConfig as FirebaseGoogleServicesConfig;
const googleWebClientId = firebaseGoogleServices.client
  .flatMap(client => client.oauth_client ?? [])
  .find(client => client.client_type === 3)?.client_id;

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor.',
      'auth/invalid-credential': 'E-posta veya şifre hatalı.',
      'auth/invalid-email': 'Geçerli bir e-posta adresi girin.',
      'auth/account-exists-with-different-credential':
        'Bu e-posta farklı bir giriş yöntemiyle kayıtlı.',
      'auth/requires-recent-login':
        'Bu işlem için yeniden giriş yapmanız gerekiyor.',
      'auth/too-many-requests':
        'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.',
      'auth/weak-password': 'Şifre en az 6 karakter olmalıdır.',
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

export function useProfileActions(): ProfileActions {
  const systemColorScheme = useColorScheme();
  const auth = useMemo(() => getAuth(), []);
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [themePreference, setThemePreference] =
    useState<ThemePreference>('system');
  const [dialog, setDialog] = useState<ProfileDialog>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [language, setLanguage] = useState('Türkçe');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);
  useEffect(() => {
    GoogleSignin.configure(
      googleWebClientId ? { webClientId: googleWebClientId } : {},
    );
  }, []);

  const isDark =
    themePreference === 'dark' ||
    (themePreference === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? MD3DarkTheme : MD3LightTheme;
  const themeLabel =
    themePreference === 'system'
      ? 'Sistem'
      : themePreference === 'dark'
        ? 'Koyu'
        : 'Açık';

  const handleGoogleSignIn = async () => {
    if (!googleWebClientId) {
      setMessage(
        'Google ile giriş için Firebase Console’da Google sağlayıcısını etkinleştirip web OAuth istemcisi içeren google-services.json dosyasını yenileyin.',
      );
      return;
    }

    setIsBusy(true);

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
          'Google ile giriş için Firebase projenizde Google sağlayıcısını etkinleştirip web istemci kimliğini GoogleSignin yapılandırmasına ekleyin.',
        );
      }

      await signInWithCredential(
        auth,
        GoogleAuthProvider.credential(response.data.idToken),
      );
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }

    setIsBusy(true);

    try {
      await deleteUser(user);
      setDialog(null);
      setMessage('Hesabınız silindi.');
    } catch (error) {
      setDialog(null);
      setMessage(getErrorMessage(error));
    } finally {
      setIsBusy(false);
    }
  };

  const handleOpenDeviceSettings = async () => {
    try {
      await Linking.openSettings();
      setDialog(null);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleThemeChange = (value: string) => {
    if (value === 'system' || value === 'light' || value === 'dark') {
      setThemePreference(value);
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
  };

  const dismissDialog = () => {
    setDialog(null);
  };

  const dismissMessage = () => {
    setMessage('');
  };

  const renderIcon: ProfileActions['renderIcon'] =
    name =>
      ({ color }) =>
        createElement(Icon, { source: name, size: 22, color });

  const renderTrailingValue: ProfileActions['renderTrailingValue'] = (
    value,
    showArrow = true,
  ) => () =>
      createElement(
        View,
        { style: styles.trailingValue },
        createElement(
          Text,
          {
            variant: 'bodyMedium',
            style: styles.trailingLabel,
            children: value,
          },
        ),
        showArrow
          ? createElement(Icon, { source: 'chevron-right', size: 22 })
          : null,
      );

  const renderNotificationsSwitch: NonNullable<ListItemProps['right']> =
    () =>
      createElement(Switch, {
        value: notificationsEnabled,
        onValueChange: handleNotificationsChange,
      });

  return {
    user,
    theme,
    themePreference,
    themeLabel,
    dialog,
    isBusy,
    language,
    notificationsEnabled,
    message,
    openSignIn: handleGoogleSignIn,
    handleSignOut,
    handleDeleteAccount,
    handleOpenDeviceSettings,
    handleThemeChange,
    handleLanguageChange,
    handleNotificationsChange,
    dismissDialog,
    dismissMessage,
    openThemeDialog: () => setDialog('theme'),
    openLanguageDialog: () => setDialog('language'),
    openDeleteDialog: () => setDialog('delete'),
    openPrivacyDialog: () => setDialog('privacy'),
    renderIcon,
    renderTrailingValue,
    renderNotificationsSwitch,
  };
}
