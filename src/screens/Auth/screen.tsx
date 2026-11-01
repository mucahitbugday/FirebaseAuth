import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  Appbar,
  Button,
  Divider,
  HelperText,
  Snackbar,
  Text,
  TextInput,
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
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Hesabınıza giriş yapın
        </Text>
        <TextInput
          label="E-posta"
          value={auth.email}
          onChangeText={auth.setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          mode="outlined"
          editable={!auth.isBusy}
        />
        <TextInput
          label="Şifre"
          value={auth.password}
          onChangeText={auth.setPassword}
          autoCapitalize="none"
          autoComplete="password"
          secureTextEntry
          mode="outlined"
          editable={!auth.isBusy}
          onSubmitEditing={auth.handleEmailPasswordSignIn}
          returnKeyType="go"
        />
        <Button
          mode="contained"
          onPress={auth.handleEmailPasswordSignIn}
          loading={auth.isBusy}
          disabled={auth.isBusy}
        >
          Giriş yap
        </Button>

        {auth.error ? (
          <HelperText type="error" visible style={styles.error}>
            {auth.error}
          </HelperText>
        ) : null}

        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Sosyal medya ile giriş
        </Text>
        <View style={styles.providerButtons}>
          <Button
            mode="outlined"
            icon="google"
            onPress={auth.handleGoogleSignIn}
            loading={auth.isBusy}
            disabled={auth.isBusy}
          >
            Google ile devam et
          </Button>
          <Button
            mode="outlined"
            icon="apple"
            onPress={auth.handleAppleSignIn}
            disabled={auth.isBusy}
          >
            Apple ile devam et
          </Button>
          <Button
            mode="outlined"
            icon="facebook"
            onPress={auth.handleFacebookSignIn}
            disabled={auth.isBusy}
          >
            Facebook ile devam et
          </Button>
          <Button
            mode="outlined"
            icon="twitter"
            onPress={auth.handleTwitterSignIn}
            disabled={auth.isBusy}
          >
            Twitter ile devam et
          </Button>
          <Button
            mode="outlined"
            icon="microsoft"
            onPress={auth.handleMicrosoftSignIn}
            disabled={auth.isBusy}
          >
            Microsoft ile devam et
          </Button>
        </View>

        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Diğer giriş yöntemleri
        </Text>
        <View style={styles.otherMethods}>
          <TextInput
            label="Telefon numarası"
            placeholder="+905551234567"
            value={auth.phoneNumber}
            onChangeText={auth.setPhoneNumber}
            keyboardType="phone-pad"
            autoComplete="tel"
            mode="outlined"
            editable={!auth.isBusy}
          />
          {auth.isPhoneCodeSent ? (
            <>
              <TextInput
                label="6 haneli SMS doğrulama kodu"
                value={auth.verificationCode}
                onChangeText={auth.setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
                autoComplete="sms-otp"
                mode="outlined"
                editable={!auth.isBusy}
              />
              <Button
                mode="outlined"
                icon="cellphone-check"
                onPress={auth.handleConfirmPhoneCode}
                loading={auth.isBusy}
                disabled={auth.isBusy}
              >
                Kodu doğrula
              </Button>
            </>
          ) : (
            <Button
              mode="outlined"
              icon="cellphone"
              onPress={auth.handleSendPhoneCode}
              loading={auth.isBusy}
              disabled={auth.isBusy}
            >
              SMS kodu gönder
            </Button>
          )}
          <Button
            mode="outlined"
            icon="email-outline"
            onPress={
              auth.isEmailLinkPending
                ? auth.handleCompleteEmailLinkSignIn
                : auth.handleSendEmailLink
            }
            loading={auth.isBusy}
            disabled={auth.isBusy}
          >
            {auth.isEmailLinkPending
              ? 'E-posta bağlantısıyla giriş yap'
              : 'E-posta bağlantısı gönder'}
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={Boolean(auth.message)}
        onDismiss={auth.dismissMessage}
      >
        {auth.message}
      </Snackbar>
    </>
  );
}
