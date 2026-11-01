import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    gap: 12,
    maxWidth: 560,
    padding: 20,
    paddingBottom: 36,
    width: '100%',
  },
  title: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 4,
    textAlign: 'center',
  },
  providerButtons: {
    gap: 8,
  },
  otherMethods: {
    gap: 8,
  },
  error: {
    marginTop: -8,
  },
  divider: {
    marginVertical: 8,
  },
});
