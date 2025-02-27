import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatter";
import { requiredUser } from "@/lib/required-user";
import { AvatarFallback } from "@radix-ui/react-avatar";

export async function RecentInvoices() {
  const { user } = await requiredUser();
  const userId = user?.id!;
  const data = await db.invoice.findMany({
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
      currency: true,
    },

    where: {
      userId: userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 7,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.map((item) => (
          <div className="flex items-center gap-4" key={item.id}>
            <Avatar className="hidden sm:flex size-9">
              <AvatarFallback>{item.clientName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leadin-none">
                {item.clientName}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.clientEmail}
              </p>
            </div>
            <div className="ml-auto font-medium">
              {formatCurrency(item.total, item.currency)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
