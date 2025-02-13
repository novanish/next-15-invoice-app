"use server";

import { db } from "@/lib/db";
import { requiredUser } from "@/lib/required-user";
import { onboardingSchema } from "@/schemas/onboarding";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

export async function onboardUser(_: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const { user } = await requiredUser();
  await db.user.update({
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
    where: { id: user.id },
  });

  return redirect("/dashboard");
}
