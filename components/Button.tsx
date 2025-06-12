import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES, FONTS } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const Button = ({
  title,
  onPress,
  color = COLORS.primary,
  textColor = COLORS.white,
  style,
  textStyle,
  disabled = false,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? COLORS.gray : color },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    ...FONTS.h4,
    fontFamily: 'Inter-SemiBold',
  },
});

export default Button;