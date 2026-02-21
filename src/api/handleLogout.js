import toast from "react-hot-toast";
import { supabase } from "../supabase/supabaseClient";

export const handleLogout = async (navigate) => {
  try {
    const { error } = await supabase.auth.signOut(); //
    if (error) throw error;

    toast.success("Logged out successfully ✅");
    navigate("/login"); //
  } catch (err) {
    toast.error(err.message || "Logout failed");
  }
};
