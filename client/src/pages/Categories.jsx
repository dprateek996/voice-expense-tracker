import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import useExpenseStore from "@/store/expenseStore";
import { Card, CardContent } from "@/components/ui/card";
import { WobbleCard } from "@/components/ui/wobble-card";

const CATEGORY_COLORS = {
  food: "#FF6B6B",
  travel: "#FFA726",
  bills: "#FFD93D",
  shopping: "#6BCF7F",
  entertainment: "#4ECDC4",
  medicine: "#5DADE2",
  other: "#95A5A6"
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

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Track your spending by category
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pie Chart Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-border shadow-2xl dark:border-border/50">
              <CardContent className="p-8 flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-square">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {categoryData.map((entry, index) => (
                          <linearGradient key={`gradient-${index}`} id={`gradient-${entry.category}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius="80%"
                        innerRadius="0%"
                        dataKey="value"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={2}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#gradient-${entry.category})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          color: 'white',
                          padding: '12px'
                        }}
                        formatter={(value, name, props) => [
                          `₹${value.toFixed(2)} (${props.payload.percentage}%)`,
                          props.payload.name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Budget Card */}
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Budget Usage</h3>
                  <span className="text-2xl font-bold text-foreground">{budgetUsagePercent}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>₹{totalSpent.toFixed(2)}</span>
                  <span>₹{budget.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Category Items */}
            <div className="grid grid-cols-1 gap-3">
              {categoryData.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <WobbleCard containerClassName="min-h-[90px]">
                    <div className="flex items-center gap-4 -mt-8">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="text-white text-lg font-bold">
                          {category.percentage}%
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground capitalize">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.count} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">₹{category.value.toFixed(2)}</p>
                      </div>
                    </div>
                  </WobbleCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Categories;
