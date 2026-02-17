"use client";
import { encryptData } from "@/lib/encryption";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useLoginMutation } from "@/store/services/authApi";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@/store/slices/authSlice";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [login, { isLoading, error }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await login({ email, password }).unwrap();
      const { token, user } = result?.data;

      // Update Redux state immediately
      dispatch(loginAction({ token, user }));

      // Store token in cookie
      Cookies.set("token", token, { expires: 1 }); // Expires in 1 day

      // Store user data in localStorage
      const encryptedUser = encryptData(user);
      if (encryptedUser) {
        localStorage.setItem("user", encryptedUser);
      }

      toast.success("Login successful");
      router.push("/");
    } catch (err: any) {
      const errorMessage =
        err?.data?.error?.message ||
        "Login failed. Please check your credentials.";

      toast.error(errorMessage);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/reset-password"
                    className="ml-auto cursor-pointer inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
              <Field>

                <Button
                  type="submit"
                  className="cursor-pointer w-full bg-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}