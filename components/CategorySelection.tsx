import { useTheme } from "@/context/ThemeContext";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface Category {
  value: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

interface CategorySelectionProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

interface AnimatedCategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

const AnimatedCategoryItem = ({
  category,
  isSelected,
  onSelect,
}: AnimatedCategoryItemProps) => {
  const { colors } = useTheme();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isSelected ? 1 : 0, { duration: 150 }),
      transform: [
        {
          scale: withTiming(isSelected ? 1 : 0.8, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onSelect(category.value)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: isSelected
              ? category.color || colors.primary
              : "transparent",
          },
        ]}
      >
        {category.icon}
        {isSelected && (
          <Animated.View
            style={[
              styles.selectedIndicator,
              { backgroundColor: category.color || colors.primary },
              animatedStyles,
            ]}
          />
        )}
      </View>
      <Text
        style={[
          styles.categoryLabel,
          { color: colors.textPrimary },
          isSelected && {
            color: colors.primary,
            fontFamily: "Inter-Medium",
          },
        ]}
        numberOfLines={1}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );
};

const CategorySelection = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectionProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <AnimatedCategoryItem
          key={category.value}
          category={category}
          isSelected={category.value === selectedCategory}
          onSelect={onSelectCategory}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    width: 72,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: -2,
    width: 16,
    height: 4,
    borderRadius: 2,
  },
  categoryLabel: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default CategorySelection;
