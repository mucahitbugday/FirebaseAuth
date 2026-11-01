import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Profile: undefined;
  Auth: undefined;
};

export type AuthScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Auth'
>;

export interface AuthActions {
  isBusy: boolean;
  error: string;
  handleBack: () => void;
  handleGoogleSignIn: () => Promise<void>;
}
