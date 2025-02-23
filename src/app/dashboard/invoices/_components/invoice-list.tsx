import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/formatter";
import { requiredUser } from "@/lib/required-user";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { InvoiceActions } from "./invoice-actions";

export async function InvoiceList() {
  const { user } = await requiredUser();
  const data = await db.invoice.findMany({
    select: {
      id: true,
      date: true,
      total: true,
      status: true,
      currency: true,
      clientName: true,
      invoiceNumber: true,
    },
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 7,
  });

  return (
    <>
      {data.length === 0 ? null : (
        // <EmptyState
        //   title="No invoices found"
        //   description="Create an invoice to get started"
        //   buttontext="Create invoice"
        //   href="/dashboard/invoices/create"
        // />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>#{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>
                  {formatCurrency(invoice.total, invoice.currency)}
                </TableCell>
                <TableCell>
                  <Badge>{invoice.status}</Badge>
                </TableCell>
                <TableCell>
                  {formatDate(invoice.date, "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <InvoiceActions status={invoice.status} id={invoice.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
