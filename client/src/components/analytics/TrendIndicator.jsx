import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * TrendIndicator - Shows trend direction with percentage change
 */
const TrendIndicator = ({ value, isPositive, suffix = '%' }) => {
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-red-500' : 'text-green-500';
    const bgClass = isPositive ? 'bg-red-500/10' : 'bg-green-500/10';

    return (
        <motion.div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bgClass} ${colorClass} text-xs font-semibold`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Icon className="w-3 h-3" />
            <span>{Math.abs(value).toFixed(1)}{suffix}</span>
        </motion.div>
    );
};

export default TrendIndicator;
