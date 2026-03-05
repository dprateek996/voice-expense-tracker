import { cn } from '@/lib/utils';

const Shimmer = ({ className }) => (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
);

/** Skeleton for a stat card (DashboardHome) */
export const SkeletonStatCard = () => (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
            <Shimmer className="h-11 w-11 rounded-md" />
            <div className="space-y-2">
                <Shimmer className="h-3 w-20" />
                <Shimmer className="h-6 w-28" />
            </div>
        </div>
    </div>
);

/** Skeleton for a table row (History) */
export const SkeletonTableRow = () => (
    <tr className="border-b border-border">
        <td className="p-4"><Shimmer className="h-4 w-20" /></td>
        <td className="p-4"><Shimmer className="h-4 w-32" /></td>
        <td className="p-4"><Shimmer className="h-4 w-16" /></td>
        <td className="p-4 text-right"><Shimmer className="ml-auto h-4 w-16" /></td>
        <td className="p-4 text-right"><Shimmer className="ml-auto h-4 w-8" /></td>
    </tr>
);

/** Skeleton for a recent expense row (DashboardHome) */
export const SkeletonExpenseRow = () => (
    <div className="flex items-center justify-between border-b border-border px-6 py-3 last:border-none">
        <div className="space-y-1.5">
            <Shimmer className="h-4 w-28" />
            <Shimmer className="h-3 w-16" />
        </div>
        <div className="space-y-1.5 text-right">
            <Shimmer className="ml-auto h-4 w-16" />
            <Shimmer className="ml-auto h-3 w-12" />
        </div>
    </div>
);

/** Skeleton for budget progress bar */
export const SkeletonBudgetBar = () => (
    <div className="surface-2 rounded-lg border border-border card-pad-default shadow-sm">
        <div className="flex items-center justify-between">
            <Shimmer className="h-5 w-32" />
            <Shimmer className="h-4 w-16" />
        </div>
        <Shimmer className="mt-3 h-2.5 w-full rounded-full" />
        <Shimmer className="mt-2 h-4 w-40" />
    </div>
);

export { Shimmer };
export default SkeletonStatCard;
