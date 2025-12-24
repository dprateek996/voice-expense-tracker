import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';

const ExpenseConfirmation = ({ expenses, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    if (!expenses || expenses.length === 0) return null;

    const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-24 right-4 z-50 w-full max-w-sm"
            >
                <Card className="glass-card border-primary/20 shadow-2xl shadow-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary" />
                            </div>
                            Expense Added!
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onDismiss}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {expenses.map((expense, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground">{expense.description}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{expense.category}</span>
                                    </div>
                                    <div className="font-bold text-foreground">₹{expense.amount}</div>
                                </div>
                            ))}

                            {expenses.length > 1 && (
                                <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center font-bold text-foreground">
                                    <span>Total</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExpenseConfirmation;
