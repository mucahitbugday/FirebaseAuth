import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { User } from '@react-native-firebase/auth';
import type { ComponentProps } from 'react';
import type { Icon, ListItemProps } from 'react-native-paper';
import type { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ProfileDialog =
  | 'auth'
  | 'theme'
  | 'language'
  | 'delete'
  | 'privacy'
  | null;
export type AuthMode = 'signIn' | 'createAccount';

export type ProfileStackParamList = {
  Main: undefined;
  Profile: undefined;
};

export type ProfileScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'Profile'
>;

export interface ProfileActions {
  user: User | null;
  theme: typeof MD3DarkTheme | typeof MD3LightTheme;
  themePreference: ThemePreference;
  themeLabel: string;
  dialog: ProfileDialog;
  authMode: AuthMode;
  fullName: string;
  email: string;
  password: string;
  authError: string;
  isBusy: boolean;
  language: string;
  notificationsEnabled: boolean;
  message: string;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  openCreateAccount: () => void;
  openSignIn: () => void;
  handleAuthentication: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  handleOpenDeviceSettings: () => Promise<void>;
  handleThemeChange: (value: string) => void;
  handleLanguageChange: (value: string) => void;
  handleAuthModeToggle: () => void;
  handleNotificationsChange: (enabled: boolean) => void;
  dismissDialog: () => void;
  dismissMessage: () => void;
  openThemeDialog: () => void;
  openLanguageDialog: () => void;
  openDeleteDialog: () => void;
  openPrivacyDialog: () => void;
  renderIcon: (
    name: ComponentProps<typeof Icon>['source'],
  ) => NonNullable<ListItemProps['right']>;
  renderTrailingValue: (
    value: string,
    showArrow?: boolean,
  ) => NonNullable<ListItemProps['right']>;
  renderNotificationsSwitch: NonNullable<ListItemProps['right']>;
}
