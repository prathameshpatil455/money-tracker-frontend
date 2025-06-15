import Header from "@/components/Header";
import TransactionItem from "@/components/TransactionItem";
import { useTheme } from "@/context/ThemeContext";
import { useTransactionStore } from "@/store/transaction";
import {
  ChevronRight,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import { useEffect, useState } from "react";
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
  const { colors } = useTheme();
  const [activeTimeframe, setActiveTimeframe] = useState("week");
  const { transactions, loading, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  // Line chart data
  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [500, 700, 650, 800, 950, 1200],
        color: () => colors.primary,
        strokeWidth: 2,
      },
      {
        data: [300, 450, 380, 500, 600, 450],
        color: () => colors.error,
        strokeWidth: 2,
      },
    ],
    legend: ["Income", "Expense"],
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Dashboard" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
            <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>
              <IndianRupee size={24} color={colors.textPrimary} />
              {balance.toFixed(2)}
            </Text>
          </View>
          <View style={styles.incomeExpenseRow}>
            <View style={styles.incomeContainer}>
              <View style={[styles.iconContainer]}>
                <TrendingUp size={20} color={colors.primary} />
              </View>
              <View style={styles.amountContainer}>
                <Text
                  style={[styles.amountLabel, { color: colors.textPrimary }]}
                >
                  Income
                </Text>
                <Text
                  style={[styles.amountText, { color: colors.textPrimary }]}
                >
                  <IndianRupee size={12} color={colors.textPrimary} />
                  {totalIncome.toFixed(2)}
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
                  style={[styles.amountLabel, { color: colors.textPrimary }]}
                >
                  Expense
                </Text>
                <Text
                  style={[styles.amountText, { color: colors.textPrimary }]}
                >
                  <IndianRupee size={12} color={colors.textPrimary} />
                  {totalExpenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Spending Overview */}
        <View
          style={[
            styles.chartSection,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Spending Overview
          </Text>
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
                labelColor: (opacity = 1) => `rgba(189, 189, 189, ${opacity})`,
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
          <View style={styles.timeframeContainer}>
            <View style={styles.timeframeSelector}>
              {["week", "month", "year"].map((timeframe) => (
                <TouchableOpacity
                  key={timeframe}
                  style={[
                    styles.timeframeButton,
                    activeTimeframe === timeframe && {
                      backgroundColor: colors.primary,
                    },
                  ]}
                  onPress={() => setActiveTimeframe(timeframe)}
                >
                  <Text
                    style={[
                      styles.timeframeText,
                      { color: colors.textPrimary },
                      activeTimeframe === timeframe && { color: colors.white },
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
        <View
          style={[
            styles.chartSection,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Expense Categories
          </Text>
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
                  <Text
                    style={[styles.legendText, { color: colors.textPrimary }]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.legendAmount,
                      { color: colors.textSecondary },
                    ]}
                  >
                    <IndianRupee size={10} color={colors.textSecondary} />
                    {item.amount.toFixed(2)} (
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
            <Text
              style={[
                styles.sectionTitle,
                { marginBottom: 4 },
                { color: colors.textPrimary },
              ]}
            >
              Recent Transactions
            </Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View All
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.transactionsList}>
            {loading ? (
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                Loading transactions...
              </Text>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction._id}
                  transaction={transaction}
                  isLast={index === recentTransactions.length - 1}
                />
              ))
            ) : (
              <Text
                style={[
                  styles.noTransactionsText,
                  { color: colors.textSecondary },
                ]}
              >
                No transactions yet
              </Text>
            )}
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
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  balanceHeader: {
    marginBottom: 20,
  },
  balanceTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 32,
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
    padding: 20,
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
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    marginRight: 4,
  },
  transactionsList: {
    marginTop: 8,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  noTransactionsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
});

export default Dashboard;
