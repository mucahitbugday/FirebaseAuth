import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  profileHeader: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  profileAvatar: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    marginBottom: 4,
  },
 
  profileTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
  signInButton: {
    borderRadius: 28,
    minWidth: 92,
  },
  signInButtonContent: {
    minHeight: 46,
  },
  promoCard: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  promoCardDark: {
    backgroundColor: '#713900',
  },
  promoCardLight: {
    backgroundColor: '#C45A00',
  },
  promoContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minHeight: 88,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  plusBadge: {
    alignItems: 'center',
    borderRadius: 28,
    justifyContent: 'center',
    minWidth: 70,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  plusBadgeText: {
    fontWeight: '800',
  },
  promoTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  promoText: {
    flex: 1,
    gap: 3,
  },
  promoDescription: {
    color: '#FFFFFF',
  },
  widgetCard: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  widgetContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    minHeight: 112,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  widgetEmoji: {
    fontSize: 42,
  },
  widgetText: {
    flex: 1,
    gap: 3,
  },
  mutedText: {
    opacity: 0.68,
  },
  menuGroup: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  menuItem: {
    // minHeight: 74,
  },
  rowTitle: {
    fontWeight: '600',
  },
  separator: {
    paddingLeft: 60,
  },
  separatorLine: {
    height: StyleSheet.hairlineWidth,
  },
  trailingValue: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  versionText: {
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 12,
    opacity: 0.65,
  },
});
