import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * InsightCard - AI-style insight cards with icons
 */
const InsightCard = ({ type = 'tip', title, description, icon: CustomIcon }) => {
    const config = {
        tip: {
            icon: Lightbulb,
            bgClass: 'bg-blue-500/10',
            iconClass: 'text-blue-500',
            borderClass: 'border-blue-500/20'
        },
        warning: {
            icon: AlertTriangle,
            bgClass: 'bg-amber-500/10',
            iconClass: 'text-amber-500',
            borderClass: 'border-amber-500/20'
        },
        success: {
            icon: CheckCircle2,
            bgClass: 'bg-green-500/10',
            iconClass: 'text-green-500',
            borderClass: 'border-green-500/20'
        }
    };

    const { icon: DefaultIcon, bgClass, iconClass, borderClass } = config[type] || config.tip;
    const Icon = CustomIcon || DefaultIcon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className={`border ${borderClass} ${bgClass} backdrop-blur-sm`}>
                <CardContent className="p-4">
                    <div className="flex gap-3">
                        <div className={`${iconClass} shrink-0 mt-0.5`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-1">{title}</h4>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default InsightCard;
