import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './src/screens/Profile';
import AuthScreen from './src/screens/Auth';
import type { RootStackParamList } from './src/screens/Auth';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { StatusBar, useColorScheme } from 'react-native';

export default function App() {
  const mode = useColorScheme();
  const isDarkMode = mode === 'dark';
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#6200ee',
      accent: '#03dac4',
      background: '#f6f6f6',
      surface: '#ffffff',
      text: '#000000',
      disabled: '#f0f0f0',
      placeholder: '#a1a1a1',
      backdrop: '#000000',
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
