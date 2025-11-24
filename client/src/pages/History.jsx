import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Search, ArrowUpDown, Calendar, Tag, DollarSign, MapPin } from "lucide-react";
import useExpenseStore from "@/store/expenseStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const History = () => {
    const { expenses } = useExpenseStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

    // Filter and Sort Logic
    const filteredExpenses = useMemo(() => {
        let data = [...expenses];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(
                (expense) =>
                    expense.description.toLowerCase().includes(lowerTerm) ||
                    expense.category.toLowerCase().includes(lowerTerm) ||
                    expense.amount.toString().includes(lowerTerm)
            );
        }

        data.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        return data;
    }, [expenses, searchTerm, sortConfig]);

    const handleSort = (key) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className="space-y-6 p-4 md:p-0 max-w-7xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                            Transaction History
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            View and manage your past expenses
                        </p>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary transition-all duration-300"
                        />
                    </div>
                </div>

                <Card className="border-primary/10 bg-card/50 backdrop-blur-xl shadow-2xl">
                    <CardContent className="p-0">
                        <div className="rounded-md border border-primary/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[180px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("date")}
                                                className="hover:bg-transparent hover:text-primary p-0 font-semibold"
                                            >
                                                Date
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("amount")}
                                                className="hover:bg-transparent hover:text-primary p-0 font-semibold ml-auto"
                                            >
                                                Amount
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredExpenses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                No transactions found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredExpenses.map((expense, index) => (
                                            <motion.tr
                                                key={expense.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-muted/50 transition-colors border-b border-primary/5 last:border-0"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                                                        <Calendar className="h-4 w-4 opacity-70" />
                                                        {format(new Date(expense.date), "MMM d, yyyy")}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{expense.description}</div>
                                                    {expense.location && (
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {expense.location}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-colors">
                                                        {expense.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-bold text-foreground">
                                                        ₹{expense.amount.toFixed(2)}
                                                    </span>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default History;
