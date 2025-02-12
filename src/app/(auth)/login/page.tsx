import { SubmitButton } from "@/components/form/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth";

export default async function Login() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            "use server";
            await signIn("nodemailer", formData);
          }}
          className="flex flex-col gap-y-4"
        >
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              required
              placeholder="hello@hello.com"
            />
          </div>
          <SubmitButton>Login</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
