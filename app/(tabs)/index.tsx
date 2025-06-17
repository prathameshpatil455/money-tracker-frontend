import Header from "@/components/Header";
import TransactionItem from "@/components/TransactionItem";
import { useTheme } from "@/context/ThemeContext";
import { useAuthStore } from "@/store/auth";
import { useDashboardStore } from "@/store/dashboard";
import { useTransactionStore } from "@/store/transaction";
import { useFocusEffect } from "@react-navigation/native";
import {
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface ChartDataItem {
  name: string;
  amount: number;
  color: string;
}

interface PieDataItem {
  value: number;
  svg: { fill: string };
  key: string;
  arc: { cornerRadius: number };
}

const getCategoryColor = (
  category: string,
  type: "income" | "expense"
): string => {
  const colorMap: Record<string, string> = {
    // Income categories
    Salary: "#4CAF50", // Green
    Investments: "#2196F3", // Blue
    Gifts: "#9C27B0", // Purple
    Freelance: "#FF9800", // Orange
    Business: "#795548", // Brown
    Other: "#607D8B", // Blue Grey

    // Expense categories
    Food: "#F44336", // Red
    Transportation: "#3F51B5", // Indigo
    Entertainment: "#E91E63", // Pink
    Shopping: "#00BCD4", // Cyan
    Housing: "#673AB7", // Deep Purple
    Utilities: "#FFC107", // Amber
    Healthcare: "#009688", // Teal
    Education: "#8BC34A", // Light Green
  };

  return colorMap[category] || (type === "income" ? "#4CAF50" : "#F44336");
};

const Dashboard = () => {
  const { colors } = useTheme();
  const [activeTimeframe, setActiveTimeframe] = useState<
    "weekly" | "monthly" | "yearly"
  >("weekly");
  const {
    transactions,
    loading: transactionsLoading,
    fetchTransactions,
  } = useTransactionStore();
  const { user } = useAuthStore();
  const {
    fetchCards,
    fetchTrends,
    fetchCategories,
    stats,
    loading: dashboardLoading,
    error,
  } = useDashboardStore();

  // console.log(user, token, "token");
  console.log(stats?.categories, error, "dashboard stats");

  // Memoize the data fetching functions
  const loadInitialData = useCallback(async () => {
    try {
      await Promise.all([fetchCards(), fetchCategories(), fetchTransactions()]);
    } catch (err) {
      console.error("Error loading initial dashboard data:", err);
    }
  }, [fetchCards, fetchCategories, fetchTransactions]);

  const loadTrendsData = useCallback(
    async (timeframe: "weekly" | "monthly" | "yearly") => {
      try {
        await fetchTrends(timeframe);
      } catch (err) {
        console.error("Error loading trends data:", err);
      }
    },
    [fetchTrends]
  );

  // Load initial data when component mounts
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Load trends data when timeframe changes
  useEffect(() => {
    loadTrendsData(activeTimeframe);
  }, [activeTimeframe, loadTrendsData]);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
      loadTrendsData(activeTimeframe);
    }, [loadInitialData, loadTrendsData, activeTimeframe])
  );

  // Memoize the timeframe change handler
  const handleTimeframeChange = useCallback(
    (timeframe: "weekly" | "monthly" | "yearly") => {
      setActiveTimeframe(timeframe);
    },
    []
  );

  // Filter transactions for the recent list (last 5 transactions)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate income, expenses and balance
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Pie chart data for expense categories
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc: ChartDataItem[], curr) => {
      const existingCategory = acc.find((item) => item.name === curr.category);
      if (existingCategory) {
        existingCategory.amount += curr.amount;
      } else {
        acc.push({
          name: curr.category,
          amount: curr.amount,
          color: getRandomColor(curr.category),
        });
      }
      return acc;
    }, []);

  // Sort categories by amount for better visualization
  const sortedExpenses = [...expensesByCategory].sort(
    (a, b) => b.amount - a.amount
  );

  // Calculate total for percentage
  const totalExpense = sortedExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Format data for PieChart
  const pieData: PieDataItem[] = sortedExpenses.map((item) => ({
    value: item.amount,
    svg: { fill: item.color },
    key: item.name,
    arc: { cornerRadius: 4 },
  }));

  // Get line chart data based on active timeframe
  const getLineChartData = () => {
    if (!stats?.trends) return null;

    const currentTrends = stats.trends[activeTimeframe];
    if (!currentTrends || currentTrends.length === 0) return null;

    return {
      labels: currentTrends.map((item) => {
        if (activeTimeframe === "yearly") return item.date;
        if (activeTimeframe === "monthly") return item.date.split("-")[1]; // Show only month
        return item.date.split("-")[2]; // Show only day for weekly
      }),
      datasets: [
        {
          data: currentTrends.map((item) => item.income),
          color: () => colors.primary,
          strokeWidth: 2,
        },
        {
          data: currentTrends.map((item) => item.expense),
          color: () => colors.error,
          strokeWidth: 2,
        },
      ],
      legend: ["Income", "Expense"],
    };
  };

  const lineChartData = getLineChartData();

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Dashboard" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              loadInitialData();
              loadTrendsData(activeTimeframe);
            }}
          >
            <Text style={[styles.retryText, { color: colors.white }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <Header title="Dashboard" /> */}
      <View style={styles.greetingContainer}>
        <Text style={[styles.greetingText, { color: colors.textPrimary }]}>
          Hey,
        </Text>
        <Text style={[styles.userNameText, { color: colors.primary }]}>
          {user?.name}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                loadInitialData();
                loadTrendsData(activeTimeframe);
              }}
            >
              <Text style={[styles.retryText, { color: colors.white }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Balance Overview */}
            <View
              style={[
                styles.balanceCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <View style={styles.balanceHeader}>
                <View style={styles.balanceTitleContainer}>
                  <Wallet size={24} color={colors.textPrimary} />
                  <Text
                    style={[styles.balanceTitle, { color: colors.textPrimary }]}
                  >
                    Total Balance
                  </Text>
                </View>
                <Text
                  style={[styles.balanceAmount, { color: colors.textPrimary }]}
                >
                  <IndianRupee size={24} color={colors.textPrimary} />
                  {stats?.cards?.balance?.toFixed(2) || "0.00"}
                </Text>
              </View>
              <View style={styles.incomeExpenseRow}>
                <View style={styles.incomeContainer}>
                  <View style={[styles.iconContainer]}>
                    <TrendingUp size={20} color={colors.primary} />
                  </View>
                  <View style={styles.amountContainer}>
                    <Text
                      style={[
                        styles.amountLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Income
                    </Text>
                    <Text
                      style={[styles.amountText, { color: colors.textPrimary }]}
                    >
                      <IndianRupee size={12} color={colors.textPrimary} />
                      {stats?.cards?.totalIncome?.toFixed(2) || "0.00"}
                    </Text>
                  </View>
                </View>
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View style={styles.expenseContainer}>
                  <View style={[styles.iconContainer]}>
                    <TrendingDown size={20} color={colors.error} />
                  </View>
                  <View style={styles.amountContainer}>
                    <Text
                      style={[
                        styles.amountLabel,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Expense
                    </Text>
                    <Text
                      style={[styles.amountText, { color: colors.textPrimary }]}
                    >
                      <IndianRupee size={12} color={colors.textPrimary} />
                      {stats?.cards?.totalExpense?.toFixed(2) || "0.00"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Spending Overview */}
            <View
              style={[
                styles.chartSection,
                // { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Spending Overview
              </Text>
              <View style={styles.timeframeContainer}>
                <View style={styles.timeframeSelector}>
                  {(["weekly", "monthly", "yearly"] as const).map(
                    (timeframe) => (
                      <TouchableOpacity
                        key={timeframe}
                        style={[
                          styles.timeframeButton,
                          activeTimeframe === timeframe && {
                            backgroundColor: colors.primary,
                          },
                        ]}
                        onPress={() => handleTimeframeChange(timeframe)}
                      >
                        <Text
                          style={[
                            styles.timeframeText,
                            { color: colors.textPrimary },
                            activeTimeframe === timeframe && {
                              color: colors.white,
                            },
                          ]}
                        >
                          {timeframe.charAt(0).toUpperCase() +
                            timeframe.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
              {dashboardLoading ? (
                <View style={styles.chartLoadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Loading trends data...
                  </Text>
                </View>
              ) : lineChartData ? (
                <View style={styles.chartContainer}>
                  <LineChart
                    data={lineChartData}
                    width={screenWidth - 48}
                    height={220}
                    chartConfig={{
                      backgroundColor: colors.cardBackground,
                      backgroundGradientFrom: colors.cardBackground,
                      backgroundGradientTo: colors.cardBackground,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                      labelColor: (opacity = 1) =>
                        `rgba(189, 189, 189, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: "4",
                        strokeWidth: "2",
                        stroke: colors.cardBackground,
                      },
                    }}
                    bezier
                    style={styles.chart}
                  />
                </View>
              ) : (
                <Text
                  style={[styles.noDataText, { color: colors.textSecondary }]}
                >
                  No spending data available
                </Text>
              )}
            </View>

            {/* Categories Overview */}
            <View
              style={[
                styles.chartSection,
                // { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Categories Overview
              </Text>
              <View style={styles.categoriesContainer}>
                {/* Income Categories */}
                <View style={styles.categoryColumn}>
                  <Text
                    style={[
                      styles.categoryColumnTitle,
                      { color: colors.primary },
                    ]}
                  >
                    Income
                  </Text>
                  {stats?.categories?.income?.map((item, index) => (
                    <View key={index} style={styles.categoryItem}>
                      <View style={styles.categoryInfo}>
                        <Text
                          style={[
                            styles.categoryName,
                            { color: colors.textPrimary },
                          ]}
                        >
                          {item.category}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.percentageBadge,
                          {
                            backgroundColor: `${getCategoryColor(
                              item.category,
                              "income"
                            )}20`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.percentageText,
                            {
                              color: getCategoryColor(item.category, "income"),
                            },
                          ]}
                        >
                          {item.percentage}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Vertical Divider */}
                <View
                  style={[
                    styles.verticalDivider,
                    { backgroundColor: colors.border },
                  ]}
                />

                {/* Expense Categories */}
                <View style={styles.categoryColumn}>
                  <Text
                    style={[
                      styles.categoryColumnTitle,
                      { color: colors.error },
                    ]}
                  >
                    Expense
                  </Text>
                  {stats?.categories?.expense?.map((item, index) => (
                    <View key={index} style={styles.categoryItem}>
                      <View style={styles.categoryInfo}>
                        <Text
                          style={[
                            styles.categoryName,
                            { color: colors.textPrimary },
                          ]}
                        >
                          {item.category}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.percentageBadge,
                          {
                            backgroundColor: `${getCategoryColor(
                              item.category,
                              "expense"
                            )}20`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.percentageText,
                            {
                              color: getCategoryColor(item.category, "expense"),
                            },
                          ]}
                        >
                          {item.percentage}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Recent Transactions */}
            <View
              style={[
                styles.transactionsSection,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  Recent Transactions
                </Text>
              </View>
              {transactionsLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : transactions.length === 0 ? (
                <Text
                  style={[
                    styles.noTransactionsText,
                    { color: colors.textSecondary },
                  ]}
                >
                  No transactions yet
                </Text>
              ) : (
                transactions
                  .slice(0, 5)
                  .map((transaction) => (
                    <TransactionItem
                      key={transaction._id}
                      transaction={transaction}
                    />
                  ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// Helper function to get a color based on category name
function getRandomColor(category: string): string {
  const colors: Record<string, string> = {
    Food: "#FF6384",
    Transportation: "#36A2EB",
    Entertainment: "#FFCE56",
    Shopping: "#4BC0C0",
    Housing: "#9966FF",
    Utilities: "#FF9F40",
    Salary: "#32CD32",
    Investments: "#1E90FF",
    Freelance: "#FF7F50",
    Other: "#8A8A8A",
  };

  return (
    colors[category] || "#" + Math.floor(Math.random() * 16777215).toString(16)
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 32,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  balanceHeader: {
    marginBottom: 12,
  },
  balanceTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  balanceTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: "bold",
  },
  incomeExpenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  incomeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  expenseContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  chartSection: {
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  timeframeContainer: {
    marginTop: 8,
  },
  timeframeSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  timeframeText: {
    fontSize: 14,
  },
  pieChartContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendContainer: {
    flex: 1,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
  },
  legendAmount: {
    fontSize: 14,
  },
  transactionsSection: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  noTransactionsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  chartLoadingContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  categoryColumn: {
    flex: 1,
  },
  categoryColumnTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "600",
  },
  categoryName: {
    fontSize: 14,
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    // marginHorizontal: 2,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "500",
  },
  userNameText: {
    fontSize: 24,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});

export default Dashboard;
