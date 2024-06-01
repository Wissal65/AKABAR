import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from "react-redux";
import { store } from '../store';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    AlmaraiExtraBold: require('../assets/fonts/Almarai-ExtraBold.ttf'),
    AlmaraiBold: require('../assets/fonts/Almarai-Bold.ttf'),
    AlmaraiLight: require('../assets/fonts/Almarai-Light.ttf'),

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
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown:false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="(games)" options={{ headerShown:false }}/>
        </Stack>
    </Provider>
  );
}
