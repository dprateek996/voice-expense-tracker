import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import useExpenseStore from "@/store/expenseStore";
import { Utensils, Car, ShoppingCart, Home, Music, Coffee, Landmark, Pill } from "lucide-react";

const CATEGORY_COLORS = {
  food: "#ef4444",
  travel: "#f97316",
  bills: "#eab308",
  shopping: "#22c55e",
  entertainment: "#06b6d4",
  medicine: "#3b82f6",
  other: "#6b7280"
};

const CATEGORY_ICONS = {
  food: Utensils,
  travel: Car,
  bills: Home,
  shopping: ShoppingCart,
  entertainment: Music,
  medicine: Pill,
  other: Landmark
};

const Categories = () => {
  const { expenses, budget } = useExpenseStore();

  const categoryData = useMemo(() => {
    const categories = {};
    let total = 0;

    expenses.forEach((expense) => {
      const cat = expense.category || "other";
      const amount = expense.amount || 0;
      if (!categories[cat]) {
        categories[cat] = { name: cat, value: 0, count: 0 };
      }
      categories[cat].value += amount;
      categories[cat].count += 1;
      total += amount;
    });

    return Object.entries(categories)
      .map(([key, data]) => ({
        ...data,
        category: key,
        percentage: total > 0 ? Math.round((data.value / total) * 100) : 0,
        color: CATEGORY_COLORS[key] || CATEGORY_COLORS.other
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const totalSpent = categoryData.reduce((sum, cat) => sum + (cat.value || 0), 0);
  const budgetUsagePercent = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-xl shadow-lg p-3">
          <p className="font-semibold capitalize">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ₹{data.value.toLocaleString("en-IN")} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto w-full py-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-muted-foreground text-sm mb-1">
          Track spending by category
        </p>
        <h1 className="text-3xl font-semibold text-foreground">Categories</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Spending Distribution</h2>

          {categoryData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No expense data available
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="capitalize text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">Budget Usage</h3>
              <span className="text-2xl font-bold text-foreground">
                {budgetUsagePercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: budgetUsagePercent > 80 ? "#ef4444" : budgetUsagePercent > 50 ? "#f59e0b" : "#22c55e"
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>₹{totalSpent.toLocaleString("en-IN")}</span>
              <span>₹{budget.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {categoryData.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No categories yet
              </div>
            ) : (
              <div className="divide-y divide-border">
                {categoryData.map((category, index) => {
                  const IconComponent = CATEGORY_ICONS[category.category] || Landmark;
                  return (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color: category.color }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground capitalize">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.count} transaction{category.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ₹{category.value.toLocaleString("en-IN")}
                        </p>
                        <p className="text-sm text-muted-foreground">{category.percentage}%</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
