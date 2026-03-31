import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        setIsAllowed(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error && profile?.role === allowedRole) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }

      setLoading(false);
    };

    checkUser();
  }, [allowedRole]);

  if (loading) return <p>Loading...</p>;

  if (!isAllowed) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;