// RootLayout.js
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from "react-redux";
import { store } from '../store';
import { LevelProvider } from '@/hooks/ContextLevel';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    AlmaraiExtraBold: require('../assets/fonts/Almarai-ExtraBold.ttf'),
    AlmaraiBold: require('../assets/fonts/Almarai-Bold.ttf'),
    AlmaraiLight: require('../assets/fonts/Almarai-Light.ttf'),
    AlmaraiRegular: require('../assets/fonts/Almarai-Regular.ttf'),
    TajwalBold: require('../assets/fonts/Tajawal-Bold.ttf'),
    TajwaMedium: require('../assets/fonts/Tajawal-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <LevelProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown:false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="(games)" options={{ headerShown:false }}/>
        </Stack>
      </LevelProvider>
    </Provider>
  );
}
