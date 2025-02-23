import { requiredUser } from "@/lib/required-user";
import { CreateInvoice } from "./_components/form";

export default async function InvoiceCreationRoute() {
  const { user } = await requiredUser();

  return (
    <CreateInvoice
      address={user?.address as string}
      email={user?.email as string}
      firstName={user?.firstName as string}
      lastName={user?.lastName as string}
    />
  );
}
