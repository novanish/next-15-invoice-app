import { Suspense } from "react";
import { DashboardBlocks } from "./_components/blocks";
import { InvoiceChart } from "./_components/invoice-chart";
import { RecentInvoices } from "./_components/recent-invoices";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={<Skeleton className="w-full h-[135px] rounded-md" />}>
        <DashboardBlocks />
      </Suspense>
      <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
        <Suspense
          fallback={
            <Skeleton className="w-full h-[500px] rounded-md lg:col-span-2" />
          }
        >
          <InvoiceChart />
        </Suspense>
        <Suspense
          fallback={<Skeleton className="w-full h-[500px] rounded-md" />}
        >
          <RecentInvoices />
        </Suspense>
      </div>
    </>
  );
}
