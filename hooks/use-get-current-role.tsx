import { useSession } from "next-auth/react";

export const useGetCurrentRole = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;
  return role;
};
