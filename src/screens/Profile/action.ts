import { createElement, useEffect, useMemo, useState } from 'react';
import { Linking, useColorScheme, View } from 'react-native';
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
import { Icon, MD3DarkTheme, MD3LightTheme, Switch, Text } from 'react-native-paper';
import type { ListItemProps } from 'react-native-paper';
import { styles } from './style';
import type {
  ProfileActions,
  ProfileDialog,
  ThemePreference,
} from './type';

const googleWebClientId =
  '1042236754290-8a14k9fovaefcbjqoqpu4dbbjbv52e6e.apps.googleusercontent.com';

function getErrorMessage(error: unknown) {
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

  useEffect(() => {
    GoogleSignin.configure({ webClientId: googleWebClientId });
    return onAuthStateChanged(auth, setUser);
  }, [auth]);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleGoogleSignIn = async () => {
    setIsBusy(true);
    setMessage('');

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
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error.code === 'SIGN_IN_CANCELLED' ||
          error.code === '12501' ||
          error.code === 'ERROR_CANCELED')
      ) {
        return;
      }
      setMessage(getErrorMessage(error));
    } finally {
      setIsBusy(false);
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
      createElement(Text, {
        variant: 'bodyMedium',
        style: styles.trailingLabel,
        children: value,
      }),
      showArrow
        ? createElement(Icon, { source: 'chevron-right', size: 22 })
        : null,
    );

  const renderNotificationsSwitch: NonNullable<ListItemProps['right']> =
    () =>
      createElement(Switch, {
        value: notificationsEnabled,
        onValueChange: setNotificationsEnabled,
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
    handleLanguageChange: setLanguage,
    dismissDialog: () => setDialog(null),
    dismissMessage: () => setMessage(''),
    openThemeDialog: () => setDialog('theme'),
    openLanguageDialog: () => setDialog('language'),
    openDeleteDialog: () => setDialog('delete'),
    openPrivacyDialog: () => setDialog('privacy'),
    renderIcon,
    renderTrailingValue,
    renderNotificationsSwitch,
  };
}
