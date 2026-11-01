import { createElement, useEffect, useMemo, useState } from 'react';
import { Linking, useColorScheme, View } from 'react-native';
import {
  deleteUser,
  getAuth,
  onAuthStateChanged,
  signOut,
  type User,
} from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, MD3DarkTheme, MD3LightTheme, Switch, Text } from 'react-native-paper';
import type { ListItemProps } from 'react-native-paper';
import { styles } from './style';
import type {
  ProfileActions,
  ProfileDialog,
  RootStackParamList,
  ThemePreference,
} from './type';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Profile'>>();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [themePreference, setThemePreference] =
    useState<ThemePreference>('system');
  const [dialog, setDialog] = useState<ProfileDialog>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [language, setLanguage] = useState('Türkçe');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);

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
    openSignIn: () => navigation.navigate('Auth'),
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
