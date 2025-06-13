import Header from "@/components/Header";
import TransactionItem from "@/components/TransactionItem";
import { COLORS, FONTS, SIZES } from "@/constants/theme";
import { mockTransactions } from "@/data/mockData";
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

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
    .reduce((acc, curr) => {
      const existingCategory = acc.find((item) => item.name === curr.category);
      if (existingCategory) {
        existingCategory.amount += curr.amount;
      } else {
        acc.push({
          name: curr.category,
          amount: curr.amount,
          color: getRandomColor(curr.category),
          legendFontColor: "#7F7F7F",
          legendFontSize: 12,
        });
      }
      return acc;
    }, []);

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
          <Text style={styles.balanceTitle}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <View style={styles.incomeExpenseRow}>
            <View style={styles.incomeContainer}>
              <TrendingUp size={16} color={COLORS.success} />
              <Text style={styles.incomeText}>Income</Text>
              <Text style={[styles.amountText, { color: COLORS.success }]}>
                ${totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.expenseContainer}>
              <TrendingDown size={16} color={COLORS.expense} />
              <Text style={styles.expenseText}>Expense</Text>
              <Text style={[styles.amountText, { color: COLORS.expense }]}>
                ${totalExpenses.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Spending Overview */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
            <View style={styles.timeframeSelector}>
              <TouchableOpacity
                style={[
                  styles.timeframeButton,
                  activeTimeframe === "week" && styles.activeTimeframe,
                ]}
                onPress={() => setActiveTimeframe("week")}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    activeTimeframe === "week" && styles.activeTimeframeText,
                  ]}
                >
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeframeButton,
                  activeTimeframe === "month" && styles.activeTimeframe,
                ]}
                onPress={() => setActiveTimeframe("month")}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    activeTimeframe === "month" && styles.activeTimeframeText,
                  ]}
                >
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeframeButton,
                  activeTimeframe === "year" && styles.activeTimeframe,
                ]}
                onPress={() => setActiveTimeframe("year")}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    activeTimeframe === "year" && styles.activeTimeframeText,
                  ]}
                >
                  Year
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <LineChart
            data={lineChartData}
            width={screenWidth - 32}
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

        {/* Expense Categories */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Expense Categories</Text>
          <PieChart
            data={expensesByCategory}
            width={screenWidth - 32}
            height={200}
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
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
function getRandomColor(category) {
  const colors = {
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
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceTitle: {
    ...FONTS.h4,
    color: COLORS.grayDark,
    marginBottom: 4,
  },
  balanceAmount: {
    ...FONTS.h1,
    color: COLORS.black,
    marginBottom: SIZES.padding,
  },
  incomeExpenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  incomeContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  expenseContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: COLORS.gray,
    marginHorizontal: SIZES.padding,
  },
  incomeText: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    marginTop: 4,
  },
  expenseText: {
    ...FONTS.body4,
    color: COLORS.grayDark,
    marginTop: 4,
  },
  amountText: {
    ...FONTS.h3,
    marginTop: 2,
  },
  chartSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
  },
  chart: {
    marginVertical: 8,
    borderRadius: SIZES.radius,
  },
  timeframeSelector: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    padding: 2,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  transactionsSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
});

export default Dashboard;
