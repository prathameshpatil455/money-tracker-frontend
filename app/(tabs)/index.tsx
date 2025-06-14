import Header from "@/components/Header";
import TransactionItem from "@/components/TransactionItem";
import { COLORS, FONTS, SIZES } from "@/constants/theme";
import { mockTransactions } from "@/data/mockData";
import {
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { PieChart } from "react-native-svg-charts";

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

const Dashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("week");

  // Filter transactions for the recent list
  const recentTransactions = mockTransactions.slice(0, 5);

  // Calculate income, expenses and balance
  const totalIncome = mockTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = mockTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Pie chart data for expense categories
  const expensesByCategory = mockTransactions
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

  // Line chart data
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [500, 700, 650, 800, 950, 1200],
        color: () => COLORS.primary,
        strokeWidth: 2,
      },
      {
        data: [300, 450, 380, 500, 600, 450],
        color: () => COLORS.expense,
        strokeWidth: 2,
      },
    ],
    legend: ["Income", "Expense"],
  };

  return (
    <View style={styles.container}>
      <Header title="Dashboard" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Balance Overview */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceTitleContainer}>
              <Wallet size={24} color={COLORS.primary} />
              <Text style={styles.balanceTitle}>Total Balance</Text>
            </View>
            <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          </View>
          <View style={styles.incomeExpenseRow}>
            <View style={styles.incomeContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: COLORS.success + "20" },
                ]}
              >
                <TrendingUp size={20} color={COLORS.success} />
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Income</Text>
                <Text style={[styles.amountText, { color: COLORS.success }]}>
                  ${totalIncome.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.expenseContainer}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: COLORS.expense + "20" },
                ]}
              >
                <TrendingDown size={20} color={COLORS.expense} />
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Expense</Text>
                <Text style={[styles.amountText, { color: COLORS.expense }]}>
                  ${totalExpenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spending Overview */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Spending Overview</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={lineChartData}
              width={screenWidth - 48}
              height={220}
              chartConfig={{
                backgroundColor: COLORS.white,
                backgroundGradientFrom: COLORS.white,
                backgroundGradientTo: COLORS.white,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: COLORS.white,
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
          <View style={styles.timeframeContainer}>
            <View style={styles.timeframeSelector}>
              {["week", "month", "year"].map((timeframe) => (
                <TouchableOpacity
                  key={timeframe}
                  style={[
                    styles.timeframeButton,
                    activeTimeframe === timeframe && styles.activeTimeframe,
                  ]}
                  onPress={() => setActiveTimeframe(timeframe)}
                >
                  <Text
                    style={[
                      styles.timeframeText,
                      activeTimeframe === timeframe &&
                        styles.activeTimeframeText,
                    ]}
                  >
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Expense Categories */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Expense Categories</Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              style={{ height: 300 }}
              data={pieData}
              innerRadius="50%"
              padAngle={0.02}
            />
            <View style={styles.legendContainer}>
              {sortedExpenses.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendText}>{item.name}</Text>
                  <Text style={styles.legendAmount}>
                    ${item.amount.toFixed(2)} (
                    {((item.amount / totalExpense) * 100).toFixed(1)}%)
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsList}>
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                isLast={index === recentTransactions.length - 1}
              />
            ))}
          </View>
        </View>
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
    backgroundColor: COLORS.background,
    paddingBottom: 80,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  balanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding * 1.2,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    marginBottom: SIZES.padding,
  },
  balanceTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceTitle: {
    ...FONTS.h4,
    color: COLORS.grayDark,
    marginLeft: 8,
  },
  balanceAmount: {
    ...FONTS.h1,
    color: COLORS.black,
    fontSize: 32,
    fontWeight: "bold",
  },
  incomeExpenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.padding,
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
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    marginBottom: 4,
  },
  amountText: {
    ...FONTS.h3,
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: COLORS.gray,
    marginHorizontal: SIZES.padding,
  },
  chartSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding * 1.2,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  chartContainer: {
    alignItems: "center",
    marginTop: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 2,
  },
  pieChartContainer: {
    alignItems: "center",
    marginTop: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 2,
  },
  timeframeContainer: {
    marginTop: SIZES.padding,
    alignItems: "center",
  },
  timeframeSelector: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: 2,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTimeframe: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeframeText: {
    ...FONTS.body4,
    color: COLORS.grayDark,
  },
  activeTimeframeText: {
    color: COLORS.primary,
    fontFamily: "Inter-Medium",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    fontWeight: "600",
  },
  chart: {
    marginVertical: 8,
    borderRadius: SIZES.radius,
  },
  transactionsSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 1.5,
    padding: SIZES.padding * 1.2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginRight: 4,
  },
  transactionsList: {
    marginTop: 8,
  },
  legendContainer: {
    marginTop: SIZES.padding,
    width: "100%",
    paddingHorizontal: SIZES.padding,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    flex: 1,
  },
  legendAmount: {
    ...FONTS.body4,
    color: COLORS.black,
    fontWeight: "500",
  },
});

export default Dashboard;
