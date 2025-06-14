import { COLORS } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth";
import { Link, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { checkToken, user, token, error, loading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkToken();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    const isAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    console.log(isSignedIn, "isSignedIn");
    console.log(user, token, "user, token");

    if (!isSignedIn && !isAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && isAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments, router]);

  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require("../assets/images/DemoImage.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Money Mate</Text>
        <Text style={styles.subtitle}>Best way to manage your money</Text>

        <View style={styles.buttonContainer}>
          <Link href="/(auth)" style={styles.getStartedButton}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Link>

          <Link href="/(auth)/signup" style={styles.signupLink}>
            <Text style={styles.signupText}>
              Don&apos;t have an account? Sign up
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topIllustration: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  getStartedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  signupLink: {
    marginTop: 10,
  },
  signupText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});
