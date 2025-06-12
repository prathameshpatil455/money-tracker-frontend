import { COLORS } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../store/auth";
import styles from "../../styles/signup.styles";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const handleSignUp = () => {
    router.push("/(auth)/login");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Money Mate</Text>
            <Text style={styles.subtitle}>Best way to manage your money</Text>
          </View>
          <View style={styles.formContainer}>
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>UserName</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor={COLORS.placeholderText}
                    onChangeText={setUserName}
                    value={userName}
                    autoCapitalize="none"
                    keyboardType="default"
                  />
                </View>
              </View>

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
                    placeholder="*******"
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
                onPress={handleSignUp}
                style={styles.button}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Register</Text>
                )}
              </TouchableOpacity>
            </>

            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "600",
//     marginBottom: 24,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   error: {
//     color: "red",
//     marginBottom: 8,
//   },
//   link: {
//     color: "#4169e1",
//     marginTop: 20,
//     textAlign: "center",
//   },
// });
