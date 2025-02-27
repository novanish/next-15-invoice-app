import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { requiredUser } from "@/lib/required-user";
import { InvoiceStatus } from "@prisma/client";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { Chart } from "./chart";

export async function InvoiceChart() {
  const { user } = await requiredUser();
  const userId = user?.id!;
  const today = new Date();
  const startDateOfMonth = startOfMonth(today);
  const endDateOfMonth = endOfMonth(today);

  const result = await db.invoice.groupBy({
    _sum: {
      total: true,
    },

    by: ["date"],

    where: {
      userId,
      status: InvoiceStatus.PAID,
      date: {
        gte: startDateOfMonth,
        lte: endDateOfMonth,
      },
    },

    orderBy: {
      date: "asc",
    },
  });

  const daysInMonth = eachDayOfInterval({
    start: startDateOfMonth,
    end: endDateOfMonth,
  });

  const data = daysInMonth.map((day) => {
    const currentDay = format(day, "MMM dd");
    const totalForDay = result.find((res) => {
      return format(res.date, "MMM dd") === currentDay;
    });

    return {
      day: currentDay,
      amount: totalForDay?._sum.total ?? 0,
    };
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>Invoices paid in the current month</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart data={data} />
      </CardContent>
    </Card>
  );
}
