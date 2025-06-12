import { COLORS } from "@/constants/theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const expenseCategoriesWithIcons = [
  {
    value: "Food",
    label: "Food",
    icon: (
      <MaterialCommunityIcons
        name="silverware-fork-knife"
        size={24}
        color={COLORS.expense}
      />
    ),
    color: COLORS.expense,
  },
  {
    value: "Transportation",
    label: "Transport",
    icon: <MaterialCommunityIcons name="bus" size={24} color="#36A2EB" />,
    color: "#36A2EB",
  },
  {
    value: "Entertainment",
    label: "Fun",
    icon: <MaterialCommunityIcons name="filmstrip" size={24} color="#FFCE56" />,
    color: "#FFCE56",
  },
  {
    value: "Shopping",
    label: "Shopping",
    icon: <MaterialCommunityIcons name="shopping" size={24} color="#4BC0C0" />,
    color: "#4BC0C0",
  },
  {
    value: "Housing",
    label: "Housing",
    icon: <MaterialCommunityIcons name="home" size={24} color="#9966FF" />,
    color: "#9966FF",
  },
  {
    value: "Utilities",
    label: "Utilities",
    icon: <MaterialCommunityIcons name="flash" size={24} color="#FF9F40" />,
    color: "#FF9F40",
  },
  {
    value: "Healthcare",
    label: "Health",
    icon: (
      <MaterialCommunityIcons name="heart-pulse" size={24} color="#FF6384" />
    ),
    color: "#FF6384",
  },
  {
    value: "Other",
    label: "Other",
    icon: (
      <MaterialCommunityIcons
        name="credit-card-outline"
        size={24}
        color="#8A8A8A"
      />
    ),
    color: "#8A8A8A",
  },
];

export const incomeCategoriesWithIcons = [
  {
    value: "Salary",
    label: "Salary",
    icon: (
      <MaterialCommunityIcons
        name="briefcase"
        size={24}
        color={COLORS.success}
      />
    ),
    color: COLORS.success,
  },
  {
    value: "Investments",
    label: "Investments",
    icon: (
      <MaterialCommunityIcons name="chart-line" size={24} color="#1E90FF" />
    ),
    color: "#1E90FF",
  },
  {
    value: "Freelance",
    label: "Freelance",
    icon: <MaterialCommunityIcons name="cash-fast" size={24} color="#FF7F50" />,
    color: "#FF7F50",
  },
  {
    value: "Gifts",
    label: "Gifts",
    icon: <MaterialCommunityIcons name="gift" size={24} color="#FF6384" />,
    color: "#FF6384",
  },
  {
    value: "Rental",
    label: "Rental",
    icon: (
      <MaterialCommunityIcons
        name="office-building"
        size={24}
        color="#9966FF"
      />
    ),
    color: "#9966FF",
  },
  {
    value: "Other",
    label: "Other",
    icon: <MaterialCommunityIcons name="folder" size={24} color="#8A8A8A" />,
    color: "#8A8A8A",
  },
];
