import { UserInfo } from "@/components/user-info.component";
import { getCurrentUser } from "@/utils/auth.utils";

const ServerPage = async () => {
  const user = await getCurrentUser();

  return <UserInfo user={user} label="Server component" />;
};

export default ServerPage;
