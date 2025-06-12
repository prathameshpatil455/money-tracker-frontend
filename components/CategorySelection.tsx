import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES, FONTS } from '@/constants/theme';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

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

const CategorySelection = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategorySelectionProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = category.value === selectedCategory;
        
        // Create animated styles for the selected indicator
        const animatedStyles = useAnimatedStyle(() => {
          return {
            opacity: withTiming(isSelected ? 1 : 0, { duration: 150 }),
            transform: [
              { 
                scale: withTiming(isSelected ? 1 : 0.8, { duration: 200 }) 
              }
            ],
          };
        });

        return (
          <TouchableOpacity
            key={category.value}
            style={styles.categoryItem}
            onPress={() => onSelectCategory(category.value)}
            activeOpacity={0.7}
          >
            <View 
              style={[
                styles.iconContainer,
                { borderColor: isSelected ? category.color || COLORS.primary : 'transparent' }
              ]}
            >
              {category.icon}
              {isSelected && (
                <Animated.View 
                  style={[
                    styles.selectedIndicator,
                    { backgroundColor: category.color || COLORS.primary },
                    animatedStyles
                  ]} 
                />
              )}
            </View>
            <Text 
              style={[
                styles.categoryLabel,
                isSelected && { color: COLORS.black, fontFamily: 'Inter-Medium' }
              ]}
              numberOfLines={1}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 8,
    borderWidth: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 16,
    height: 4,
    borderRadius: 2,
  },
  categoryLabel: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    textAlign: 'center',
  },
});

export default CategorySelection;