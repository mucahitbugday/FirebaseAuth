import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text } from 'react-native-paper';
import type { ProfileStackParamList } from '../Profile/type';
import { styles } from './style';

type MainNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Main'
>;

export default function MainScreen() {
  const navigation = useNavigation<MainNavigationProp>();

  return (
    <View style={styles.screen}>
      <Text variant="headlineSmall" style={styles.title}>
        Ana sayfa
      </Text>
      <Button
        mode="contained"
        icon="account"
        onPress={() => navigation.navigate('Profile')}
      >
        Profile git
      </Button>
    </View>
  );
}
