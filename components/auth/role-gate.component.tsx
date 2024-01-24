"use client";

import { useGetCurrentRole } from "@/hooks/use-get-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-error.component";

type Props = {
  children: React.ReactNode;
  allowedRole: UserRole;
};

export const RoleGate = ({ children, allowedRole }: Props) => {
  const role = useGetCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="You are not allowed to access this page" />;
  }

  return <>{children}</>;
};
