import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Tag, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";
import useExpenseStore from "@/store/expenseStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#ff7300"
];

const Categories = () => {
    const { expenses } = useExpenseStore();

    const categoryData = useMemo(() => {
        const categories = {};
        let total = 0;

        expenses.forEach((expense) => {
            const cat = expense.category || "Uncategorized";
            if (!categories[cat]) {
                categories[cat] = { name: cat, value: 0, count: 0 };
            }
            categories[cat].value += expense.amount;
            categories[cat].count += 1;
            total += expense.amount;
        });

        return Object.values(categories)
            .sort((a, b) => b.value - a.value)
            .map((cat, index) => ({
                ...cat,
                percentage: ((cat.value / total) * 100).toFixed(1),
                color: COLORS[index % COLORS.length]
            }));
    }, [expenses]);

    return (
        <div className="space-y-6 p-4 md:p-0 max-w-7xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                        Spending Categories
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Analyze where your money goes
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart Section */}
                    <Card className="lg:col-span-1 border-primary/10 bg-card/50 backdrop-blur-xl shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.1)" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `₹${value.toFixed(2)}`}
                                            contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cards Grid Section */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categoryData.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border-primary/10 bg-card/50 backdrop-blur-sm hover:bg-primary/5 transition-colors cursor-default group h-full">
                                    <CardContent className="p-6 flex flex-col justify-between h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                                                <Tag className="h-5 w-5" style={{ color: category.color }} />
                                            </div>
                                            <span className="text-2xl font-bold">
                                                {category.percentage}%
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                                            <div className="flex justify-between items-end">
                                                <div className="text-muted-foreground text-sm">
                                                    {category.count} transactions
                                                </div>
                                                <div className="text-xl font-bold text-primary">
                                                    ₹{category.value.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress bar visual */}
                                        <div className="mt-4 h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: category.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${category.percentage}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Categories;
