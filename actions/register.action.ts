"use server";

import { z } from "zod";

import { RegisterSchema } from "../schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: "error", message: "There was a problem registering" };
  }

  return { status: "success", message: "User registered" };
};
