import { useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";
import useAuth from "./useAuth";

const useRole = () => {
  const { user, loading } = useAuth();

  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadRole = async () => {
      try {
        if (!user?.email) {
          setRole(null);
          setRoleLoading(false);
          return;
        }

        setRoleLoading(true);
        const res = await axiosSecure.get("/users/me");

        if (!ignore) {
          setRole(res.data?.role || "donor");
        }
      } catch (err) {
        if (!ignore) setRole("donor");
      } finally {
        if (!ignore) setRoleLoading(false);
      }
    };

    if (!loading) loadRole();

    return () => {
      ignore = true;
    };
  }, [user?.email, loading]);

  return { role, roleLoading };
};

export default useRole;
