"use server";

import { LoginSchema } from "@/schemas";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid fields",
    };
  }

  return {
    status: "success",
    message: "Login successful",
  };
};
