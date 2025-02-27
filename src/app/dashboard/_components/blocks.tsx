import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatter";
import { requiredUser } from "@/lib/required-user";
import { InvoiceStatus } from "@prisma/client";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

async function fetchInvoiceStats(userId: string) {
  const invoices = await db.invoice.groupBy({
    _sum: {
      total: true,
    },
    _count: {
      _all: true,
    },
    by: ["status"],
    where: {
      userId,
    },
  });

  const invoiceCounts: Record<InvoiceStatus, number> = {
    [InvoiceStatus.PAID]: 0,
    [InvoiceStatus.PENDING]: 0,
  };

  const totalRevenue = invoices.reduce((sum, invoice) => {
    invoiceCounts[invoice.status] = invoice._count._all;
    return sum + (invoice._sum?.total || 0);
  }, 0);

  return {
    invoiceCounts,
    totalRevenue,
  };
}

export async function DashboardBlocks() {
  const { user } = await requiredUser();
  const userId = user.id!;

  const { invoiceCounts, totalRevenue } = await fetchInvoiceStats(userId);
  const totalInvoicesIssued = invoiceCounts.PAID + invoiceCounts.PENDING;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">
            {formatCurrency(totalRevenue, "USD")}
          </h2>
          <p className="text-xs text-muted-foreground">Based on total volume</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Invoices Issued
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{totalInvoicesIssued}</h2>
          <p className="text-xs text-muted-foreground">Total invoices issued</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          <CreditCard className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{invoiceCounts.PAID}</h2>
          <p className="text-xs text-muted-foreground">
            Total invoices that have been paid
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Invoices
          </CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">{invoiceCounts.PENDING}</h2>
          <p className="text-xs text-muted-foreground">
            Invoices that are currently pending
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
