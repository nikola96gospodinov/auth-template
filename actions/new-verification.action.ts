"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/db/user.utils";
import { getVerificationTokenByToken } from "@/utils/db/verification-token.utils";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      status: "error" as const,
      message: "Token does not exist",
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      status: "error" as const,
      message: "Token has expired",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      status: "error" as const,
      message: "Email does not exist",
    };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return {
    status: "success" as const,
    message: "Email verified",
  };
};
