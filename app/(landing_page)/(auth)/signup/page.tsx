"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useForm } from "react-hook-form";
import { useTransition } from "react";

import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/general/CustomFormField";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const [loading, startTrans] = useTransition();
  const handleSubmit = (data: any) => {
    startTrans(async () => {
      const res = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard/home",
        name: data.name,
      });

      if (res.error) {
        toast.error(res.error.message);
        return;
      }
    });
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create account</CardTitle>
              <CardDescription>
                Enter your data to make a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form disabled={loading} {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <div className="flex flex-col gap-6">
                    <CustomFormField
                      control={form.control}
                      label="Name"
                      name="name"
                    />
                    <CustomFormField
                      control={form.control}
                      label="Email"
                      inputType="email"
                      name="email"
                    />

                    <CustomFormField
                      control={form.control}
                      label="Password"
                      inputType="password"
                      name="password"
                    />

                    <Button loading={loading} type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?
                    <a href="#" className="underline underline-offset-4">
                      Sign in
                    </a>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
