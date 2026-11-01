import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 560,
    paddingBottom: 28,
    paddingHorizontal: 20,
    width: '100%',
  },
  pageTitle: {
    fontWeight: '700',
    marginBottom: 24,
    marginTop: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    borderRadius: 52,
    height: 104,
    justifyContent: 'center',
    marginBottom: 14,
    width: 104,
  },
  profileName: {
    fontWeight: '700',
    textAlign: 'center',
  },
  profileEmail: {
    marginTop: 4,
    textAlign: 'center',
  },
  authButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  listSection: {
    marginHorizontal: -8,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  divider: {
    marginLeft: 56,
  },
  trailingValue: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  trailingLabel: {
    opacity: 0.72,
  },
  accountActions: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#80808055',
    marginTop: 20,
    paddingTop: 12,
  },
  versionText: {
    alignSelf: 'center',
    marginTop: 20,
  },
  input: {
    marginBottom: 12,
  },
});
