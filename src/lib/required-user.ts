import { redirect } from "next/navigation";
import { auth } from "./auth";
import { Session } from "next-auth";

export async function requiredUser(redirectTo = "/") {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect(redirectTo);

  return session as Required<Session> & { user: NonNullable<Session["user"]> };
}
