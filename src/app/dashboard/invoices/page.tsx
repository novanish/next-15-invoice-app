import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { InvoiceList } from "./_components/invoice-list";
import { db } from "@/lib/db";
import { requiredUser } from "@/lib/required-user";

export default async function InvoicesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
            <CardDescription>Manage your invoices right here</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/invoices/create">
              <PlusIcon /> Create Invoice
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <InvoiceList />
      </CardContent>
    </Card>
  );
}
