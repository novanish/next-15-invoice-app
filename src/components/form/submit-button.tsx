"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

type Props = React.ComponentProps<typeof Button>;

export function SubmitButton(props: Props) {
  const { pending } = useFormStatus();

  return <Button disabled={pending} {...props} type="submit" />;
}
