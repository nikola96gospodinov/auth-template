"use client";

import { set, z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "./card-wrapper.component";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error.component";
import { FormSuccess } from "../form-success.component";
import { login } from "@/actions/login.action";
import { FormWarning } from "../form-warning.component";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const urlErrorText =
    urlError === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";

  const [response, setResponse] = useState<{
    status: string;
    message: string;
  }>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setResponse(undefined);

    startTransition(async () => {
      const response = await login(values);
      setResponse(response);
    });
  };

  const showTwoFactor =
    response?.message === "Please enter your two-factor authentication code" ||
    response?.message === "Invalid code!";

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        disabled={isPending}
                        type="number"
                        min={100_000}
                        max={999_999}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          disabled={isPending}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button
              size="sm"
              variant="link"
              asChild
              className="px-0 font-normal"
            >
              <Link href="/auth/reset">Forgot Password?</Link>
            </Button>
            <FormMessage />
          </div>

          {(response?.status === "error" || urlErrorText) && (
            <FormError message={response?.message ?? urlErrorText} />
          )}

          {response?.status === "warning" && (
            <FormWarning message={response.message} />
          )}

          {response?.status === "success" && (
            <FormSuccess message={response.message} />
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
