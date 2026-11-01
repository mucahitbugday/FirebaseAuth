import { createElement, useEffect, useMemo, useState } from 'react';
import { Linking, useColorScheme } from 'react-native';
import { createUserWithEmailAndPassword, deleteUser, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, type User, } from '@react-native-firebase/auth';
import { Icon, MD3DarkTheme, MD3LightTheme, Switch, Text, } from 'react-native-paper';
import type { ListItemProps } from 'react-native-paper';
import { View } from 'react-native';
import { styles } from './style';
import type { AuthMode, ProfileActions, ProfileDialog, ThemePreference, } from './type';

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor.',
      'auth/invalid-credential': 'E-posta veya şifre hatalı.',
      'auth/invalid-email': 'Geçerli bir e-posta adresi girin.',
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
  const [authMode, setAuthMode] = useState<AuthMode>('signIn');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
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

  const openAuthentication = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError('');
    setDialog('auth');
  };

  const handleAuthentication = async () => {
    setIsBusy(true);
    setAuthError('');

    try {
      if (authMode === 'createAccount') {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        const name = fullName.trim();

        if (name) {
          await updateProfile(credential.user, { displayName: name });
          setUser(credential.user);
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      setPassword('');
      setDialog(null);
    } catch (error) {
      setAuthError(getErrorMessage(error));
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

  const handleAuthModeToggle = () => {
    setAuthMode(current =>
      current === 'signIn' ? 'createAccount' : 'signIn',
    );
    setAuthError('');
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
    authMode,
    fullName,
    email,
    password,
    authError,
    isBusy,
    language,
    notificationsEnabled,
    message,
    setFullName,
    setEmail,
    setPassword,
    openCreateAccount: () => openAuthentication('createAccount'),
    openSignIn: () => openAuthentication('signIn'),
    handleAuthentication,
    handleSignOut,
    handleDeleteAccount,
    handleOpenDeviceSettings,
    handleThemeChange,
    handleLanguageChange,
    handleAuthModeToggle,
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
