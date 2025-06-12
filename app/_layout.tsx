import SafeScreen from "@/components/SafeScreen";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../store/auth";

// Prevent auto-hide of splash
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { token, loading, checkToken } = useAuthStore();
  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  // Load token once
  useEffect(() => {
    checkToken();
  }, []);

  // Hide splash when everything is ready
  useEffect(() => {
    if ((fontsLoaded || fontError) && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, loading]);

  // Wait until fonts and auth status are ready
  if ((!fontsLoaded && !fontError) || loading) return null;

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
        </Stack>
        <StatusBar style="dark" />
      </SafeScreen>
    </SafeAreaProvider>
  );
}
