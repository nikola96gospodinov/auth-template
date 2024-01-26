"use server";

import * as z from "zod";

import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/utils/db/user.utils";
import { getCurrentUser } from "@/utils/auth.utils";
import { generateVerificationToken } from "@/utils/tokens.utils";
import { sendVerificationEmail } from "@/utils/mail.utils";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await getCurrentUser();

  if (!user) {
    return {
      status: "error",
      message: "You are not logged in",
    };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return {
      status: "error",
      message: "User not found",
    };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // !IMPORTANT! This will only update the email but not the rest of the fields
  if (values.email && values.email !== dbUser.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return {
        status: "error",
        message: "Email already in use",
      };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      status: "success",
      message: "Please verify your new email address",
    };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return {
        status: "error",
        message: "Incorrect password",
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return {
    status: "success",
    message: "Settings updated",
  };
};
