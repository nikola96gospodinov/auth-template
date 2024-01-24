"use client";

import { logout } from "@/actions/logout.action";
import { useGetCurrentUser } from "@/hooks/use-get-current-user";

const SettingsPage = () => {
  const user = useGetCurrentUser();

  return (
    <div className="bg-white p-10 rounded-md">
      <form>
        <button type="submit" onClick={() => logout()}>
          Sign Out
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
