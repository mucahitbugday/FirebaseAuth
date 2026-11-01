import React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Avatar, Button, Dialog, Divider, Icon, List, PaperProvider, Portal, RadioButton, Snackbar, Text, } from 'react-native-paper';
import { useProfileActions } from './action';
import { styles } from './style';

export default function ProfileScreen() {
  const profile = useProfileActions();

  return (
    <PaperProvider theme={profile.theme}>
      <Appbar.Header>
        <Appbar.Content title="Profil" />
      </Appbar.Header>
      <ScrollView style={[styles.screen, { backgroundColor: profile.theme.colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} >
        <View style={styles.profileHeader}>
          {profile.user?.photoURL ? (
            <Avatar.Image
              size={104}
              source={{ uri: profile.user.photoURL }}
              accessibilityLabel="Profil fotoğrafı"
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: profile.theme.colors.secondaryContainer },
              ]}
            >
              <Icon
                source="account-circle"
                size={76}
                color={profile.theme.colors.primary}
              />
            </View>
          )}

          {profile.user ? (
            <>
              <Text variant="titleLarge" style={styles.profileName}>
                {profile.user.displayName || 'Kullanıcı'}
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.profileEmail,
                  { color: profile.theme.colors.onSurfaceVariant },
                ]}
              >
                {profile.user.email || 'E-posta adresi eklenmemiş'}
              </Text>
            </>
          ) : (
            <>
              <Text variant="titleMedium" style={styles.profileName}>
                Profil bilgilerinizi görmek için giriş yapın
              </Text>
              <View style={styles.authButtons}>
                <Button
                  mode="contained"
                  icon="google"
                  onPress={profile.openSignIn}
                  loading={profile.isBusy}
                  disabled={profile.isBusy}
                >
                  Giriş yap
                </Button>
              </View>
            </>
          )}
        </View>

        <List.Section style={styles.listSection}>
          <List.Subheader style={styles.sectionTitle}>
            Uygulama tercihleri
          </List.Subheader>
          <List.Item
            title="Görünüm"
            description="Açık, koyu veya sistem ayarı"
            left={profile.renderIcon('theme-light-dark')}
            right={profile.renderTrailingValue(profile.themeLabel)}
            onPress={profile.openThemeDialog}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Dil"
            description="Uygulama dili"
            left={profile.renderIcon('translate')}
            right={profile.renderTrailingValue(profile.language)}
            onPress={profile.openLanguageDialog}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Bildirimler"
            description="Uygulama bildirimlerini etkinleştir"
            left={profile.renderIcon('bell-outline')}
            right={profile.renderNotificationsSwitch}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Gizlilik ve güvenlik"
            description="Uygulama izinlerini yönet"
            left={profile.renderIcon('shield-lock-outline')}
            right={profile.renderIcon('chevron-right')}
            onPress={profile.openPrivacyDialog}
          />
        </List.Section>

        {profile.user ? (
          <View style={styles.accountActions}>
            <Button
              mode="text"
              icon="logout"
              onPress={profile.handleSignOut}
              accessibilityLabel="Çıkış yap"
            >
              Çıkış yap
            </Button>
            <Button
              mode="text"
              icon="delete-outline"
              textColor={profile.theme.colors.error}
              onPress={profile.openDeleteDialog}
              accessibilityLabel="Hesabı sil"
            >
              Hesabı sil
            </Button>
          </View>
        ) : null}

        <Text
          variant="bodySmall"
          style={[
            styles.versionText,
            { color: profile.theme.colors.onSurfaceVariant },
          ]}
        >
          Sürüm 11.234
        </Text>
      </ScrollView>

      <Portal>
        <Dialog
          visible={profile.dialog === 'theme'}
          onDismiss={profile.dismissDialog}
        >
          <Dialog.Title>Görünüm</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              value={profile.themePreference}
              onValueChange={profile.handleThemeChange}
            >
              <RadioButton.Item label="Sistemle aynı" value="system" />
              <RadioButton.Item label="Açık" value="light" />
              <RadioButton.Item label="Koyu" value="dark" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={profile.dismissDialog}>Tamam</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={profile.dialog === 'language'}
          onDismiss={profile.dismissDialog}
        >
          <Dialog.Title>Dil</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              value={profile.language}
              onValueChange={profile.handleLanguageChange}
            >
              <RadioButton.Item label="Türkçe" value="Türkçe" />
              <RadioButton.Item label="English" value="English" />
              <RadioButton.Item label="Español" value="Español" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={profile.dismissDialog}>Tamam</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={profile.dialog === 'delete'}
          onDismiss={profile.dismissDialog}
        >
          <Dialog.Title>Hesap silinsin mi?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Bu işlem hesabınızı kalıcı olarak siler ve geri alınamaz.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={profile.dismissDialog} disabled={profile.isBusy}>
              Vazgeç
            </Button>
            <Button
              onPress={profile.handleDeleteAccount}
              loading={profile.isBusy}
              disabled={profile.isBusy}
              textColor={profile.theme.colors.error}
            >
              Hesabı sil
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={profile.dialog === 'privacy'}
          onDismiss={profile.dismissDialog}
        >
          <Dialog.Title>Gizlilik ve güvenlik</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Uygulama izinlerini cihazınızın ayarlarından yönetebilirsiniz.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={profile.dismissDialog}>Kapat</Button>
            <Button onPress={profile.handleOpenDeviceSettings}>
              Ayarları aç
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={Boolean(profile.message)}
        onDismiss={profile.dismissMessage}
      >
        {profile.message}
      </Snackbar>


    </PaperProvider>
  );
}
