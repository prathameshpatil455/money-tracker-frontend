import { COLORS } from "@/constants/Colors";
import { useNotificationStore } from "@/store/notificationStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../store/auth";
import styles from "../../styles/login.styles";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, error, clearError } = useAuthStore();
  const { expoPushToken, registerForPushNotifications, sendPushNotification } =
    useNotificationStore();

  // sendPushNotification(
  //   "Transaction removed 💰",
  //   "You added ₹199000 to Income",
  //   {
  //     type: "income",
  //     amount: 1000,
  //   }
  // );

  // useEffect(() => {
  //   registerForPushNotifications();
  // }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      clearError();
      const success = await login({ email, password });

      if (success) {
        router.replace("/(tabs)");
      } else {
        console.log(error, "error");
        Alert.alert("Login Failed", "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/DemoImage.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholderText}
                  onChangeText={setEmail}
                  value={email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.placeholderText}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  value={password}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an account?</Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
