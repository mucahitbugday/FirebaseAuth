import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Profile: undefined;
  Auth: undefined;
};

export type AuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Auth'
>;

export type OAuthSignInProvider =
  | 'apple.com'
  | 'facebook.com'
  | 'twitter.com'
  | 'microsoft.com';

export interface AuthActions {
  email: string;
  password: string;
  phoneNumber: string;
  verificationCode: string;
  isPhoneCodeSent: boolean;
  isEmailLinkPending: boolean;
  isBusy: boolean;
  error: string;
  message: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setPhoneNumber: (value: string) => void;
  setVerificationCode: (value: string) => void;
  handleBack: () => void;
  handleEmailPasswordSignIn: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleFacebookSignIn: () => Promise<void>;
  handleTwitterSignIn: () => Promise<void>;
  handleMicrosoftSignIn: () => Promise<void>;
  handleSendPhoneCode: () => Promise<void>;
  handleConfirmPhoneCode: () => Promise<void>;
  handleSendEmailLink: () => Promise<void>;
  handleCompleteEmailLinkSignIn: () => Promise<void>;
  dismissMessage: () => void;
}
