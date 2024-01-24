import { auth } from "@/auth";

export const getRole = async () => {
  const session = await auth();
  return session?.user.role;
};
