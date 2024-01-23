"use client";

import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

import { ResetSchema } from "@/schemas";
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
import { FormWarning } from "../form-warning.component";
import Link from "next/link";
import { reset } from "@/actions/reset.action";

export const ResetForm = () => {
  const [response, setResponse] = useState<{
    status: string;
    message: string;
  }>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setResponse(undefined);

    startTransition(async () => {
      const response = await reset(values);
      setResponse(response);
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
          </div>

          {response?.status === "error" && (
            <FormError message={response?.message} />
          )}

          {response?.status === "warning" && (
            <FormWarning message={response.message} />
          )}

          {response?.status === "success" && (
            <FormSuccess message={response.message} />
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
