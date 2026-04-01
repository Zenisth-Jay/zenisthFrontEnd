import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import Logo from "../components/Authentication/Logo";
import RightPanel from "../components/Authentication/RightPanel";
import InputElement from "../components/Authentication/InputElement";
import AuthButton from "../components/Authentication/AuthButton";
import { KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");

  // Check recovery session on page load
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("Current Session:", data.session);
      console.log("Auth Error:", error);

      // If there is no session, and no 'code' in the URL, the link is invalid
      if (!data.session) {
        const params = new URLSearchParams(window.location.search);
        if (!params.get("code")) {
          toast.error("Invalid or expired reset link.");
        }
      }
    };
    checkSession();
  }, []);

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast.success(
        "Password updated successfully! Please log in with your new password.",
      );

      // Force Sign Out to clear the recovery session
      await supabase.auth.signOut();

      // Redirect to login
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to update password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-[#fafafa] flex justify-center items-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md animate-fade-in-up">
          <Logo />
          <h1 className="text-2xl sm:text-4xl font-semibold text-[#212121] mt-6">
            Reset Password 🔐
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col mt-6"
          >
            <div className="flex flex-col gap-3 mb-2">
              <InputElement
                label="New Password"
                name="password"
                type="password"
                placeholder="Enter new password..."
                register={register}
                icon={KeyRound}
                rules={{
                  required: "Password is required.",
                  validate: {
                    minLength: (value) =>
                      value.length >= 8 ||
                      "Password must be at least 8 characters long.",
                    hasUppercase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must include at least one uppercase letter.",
                    hasLowercase: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must include at least one lowercase letter.",
                    hasNumber: (value) =>
                      /\d/.test(value) ||
                      "Password must include at least one number.",
                    hasSpecial: (value) =>
                      /[^A-Za-z0-9]/.test(value) ||
                      "Password must include at least one special character.",
                  },
                }}
              />
              <p className="text-xs text-[#6B7280] -mt-2">
                Use 8+ characters with uppercase, lowercase, number, and special
                character.
              </p>
              {errors.password?.message && (
                <p className="text-sm text-red-600 -mt-2">
                  {errors.password.message}
                </p>
              )}

              <InputElement
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password..."
                register={register}
                icon={KeyRound}
                rules={{
                  required: "Confirmation required",
                  validate: (val) =>
                    val === passwordValue || "Passwords do not match.",
                }}
              />
              {errors.confirmPassword?.message && (
                <p className="text-sm text-red-600 -mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <AuthButton type="submit" disabled={isSubmitting}>
              Update & Go to Login
            </AuthButton>
          </form>
        </div>
      </div>
      <RightPanel />
    </div>
  );
};

export default ChangePassword;
