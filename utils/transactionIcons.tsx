export const getTransactionIconName = (
  category: string,
  type: "income" | "expense"
) => {
  const expenseIcons = {
    Food: "silverware-fork-knife",
    Transportation: "bus",
    Entertainment: "filmstrip",
    Shopping: "shopping",
    Housing: "home",
    Utilities: "flash",
    Healthcare: "heart-pulse",
    Other: "credit-card-outline",
  };

  const incomeIcons = {
    Salary: "briefcase",
    Investments: "chart-line",
    Freelance: "cash-fast",
    Gifts: "gift",
    Rental: "office-building",
    Other: "folder",
  };

  return type === "expense"
    ? expenseIcons[category] || "credit-card-outline"
    : incomeIcons[category] || "briefcase";
};
