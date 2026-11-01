import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { User } from '@react-native-firebase/auth';
import type { ComponentProps } from 'react';
import type { Icon, ListItemProps } from 'react-native-paper';
import type { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ProfileDialog = 'theme' | 'language' | 'delete' | 'privacy' | null;

export type ProfileScreenProps = NativeStackScreenProps<
  { Profile: undefined },
  'Profile'
>;

export interface ProfileActions {
  user: User | null;
  theme: typeof MD3DarkTheme | typeof MD3LightTheme;
  themePreference: ThemePreference;
  themeLabel: string;
  dialog: ProfileDialog;
  isBusy: boolean;
  language: string;
  notificationsEnabled: boolean;
  message: string;
  openSignIn: () => void;
  openAuth: () => void;
  handleSignOut: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  handleOpenDeviceSettings: () => Promise<void>;
  handleThemeChange: (value: string) => void;
  handleLanguageChange: (value: string) => void;
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
