"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetToken } from "@/utils/db/password-reset-token.utils";
import { getUserByEmail } from "@/utils/db/user.utils";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return {
      status: "error",
      message: "Missing token",
    };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      status: "error",
      message: "Invalid fields",
    };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetToken(token);

  if (!existingToken) {
    return {
      status: "error",
      message: "Invalid token",
    };
  }

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return {
      status: "error",
      message: "Token has expired",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      status: "error",
      message: "Email does not exist",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    status: "success",
    message: "Password updated",
  };
};
