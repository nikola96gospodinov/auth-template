"use client";

import { UserInfo } from "@/components/user-info.component";
import { useGetCurrentUser } from "@/hooks/use-get-current-user";

const ServerPage = () => {
  const user = useGetCurrentUser();

  return <UserInfo user={user} label="Client component" />;
};

export default ServerPage;
