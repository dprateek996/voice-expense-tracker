import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * DateRangePicker - Select predefined date ranges
 */
const DateRangePicker = ({ onRangeChange, currentRange }) => {
    const ranges = [
        { label: 'Last 7 Days', value: 7 },
        { label: 'Last 30 Days', value: 30 },
        { label: 'Last 90 Days', value: 90 },
        { label: 'This Month', value: 'month' },
        { label: 'Last 6 Months', value: 180 },
        { label: 'This Year', value: 'year' },
        { label: 'All Time', value: 'all' }
    ];

    const getLabel = () => {
        const range = ranges.find(r => r.value === currentRange);
        return range ? range.label : 'Select Range';
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    {getLabel()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {ranges.map((range) => (
                    <DropdownMenuItem
                        key={range.value}
                        onClick={() => onRangeChange(range.value)}
                        className={currentRange === range.value ? 'bg-primary/10' : ''}
                    >
                        {range.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DateRangePicker;
