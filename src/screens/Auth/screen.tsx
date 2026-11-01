import React from 'react';
import { View } from 'react-native';
import {
  Appbar,
  Button,
  HelperText,
  Text,
} from 'react-native-paper';
import { useAuthActions } from './action';
import { styles } from './style';

export default function AuthScreen() {
  const auth = useAuthActions();

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={auth.handleBack} />
        <Appbar.Content title="Giriş yap" />
      </Appbar.Header>
      <View style={styles.screen}>
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>
            Hesabınıza giriş yapın
          </Text>
          <Button
            mode="contained"
            icon="google"
            onPress={auth.handleGoogleSignIn}
            loading={auth.isBusy}
            disabled={auth.isBusy}
          >
            Google ile devam et
          </Button>
          {auth.error ? (
            <HelperText type="error" visible style={styles.error}>
              {auth.error}
            </HelperText>
          ) : null}
        </View>
      </View>
    </>
  );
}
