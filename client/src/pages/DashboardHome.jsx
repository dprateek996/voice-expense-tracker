import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  ShoppingCart,
  CreditCard,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

const chartData = [
  { category: "Food", expenses: 450, fill: "var(--color-food)" },
  { category: "Transport", expenses: 200, fill: "var(--color-transport)" },
  { category: "Shopping", expenses: 300, fill: "var(--color-shopping)" },
  { category: "Utilities", expenses: 150, fill: "var(--color-utilities)" },
];

const chartConfig = {
  expenses: {
    label: "Expenses",
  },
  food: {
    label: "Food",
    color: "hsl(var(--chart-1))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--chart-2))",
  },
  shopping: {
    label: "Shopping",
    color: "hsl(var(--chart-3))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-4))",
  },
};

export default function DashboardHome() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,450.50</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Spent On
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Food</div>
            <p className="text-xs text-muted-foreground">
              ₹4,890 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+34</div>
            <p className="text-xs text-muted-foreground">
              in the last 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active Day</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Friday</div>
            <p className="text-xs text-muted-foreground">
              Average of ₹850
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>
                Your latest 5 transactions.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link to="/dashboard/history">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden xl:table-column">Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Zomato</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Dinner
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Food</TableCell>
                  <TableCell className="text-right">₹250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Uber</div>
                     <div className="hidden text-sm text-muted-foreground md:inline">
                      Commute
                    </div>
                  </TableCell>
                   <TableCell className="hidden xl:table-column">Transport</TableCell>
                  <TableCell className="text-right">₹150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">H&M</div>
                     <div className="hidden text-sm text-muted-foreground md:inline">
                      T-shirt
                    </div>
                  </TableCell>
                   <TableCell className="hidden xl:table-column">Shopping</TableCell>
                  <TableCell className="text-right">₹800.00</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Fuel</div>
                     <div className="hidden text-sm text-muted-foreground md:inline">
                      Petrol
                    </div>
                  </TableCell>
                   <TableCell className="hidden xl:table-column">Transport</TableCell>
                  <TableCell className="text-right">₹500.00</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Groceries</div>
                     <div className="hidden text-sm text-muted-foreground md:inline">
                      Weekly shopping
                    </div>
                  </TableCell>
                   <TableCell className="hidden xl:table-column">Food</TableCell>
                  <TableCell className="text-right">₹1,200.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
            <CardDescription>Your spending by category this month.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
             <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie data={chartData} dataKey="expenses" nameKey="category" innerRadius={60}>
                     {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Top category: Food
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total expenses for the current month
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}