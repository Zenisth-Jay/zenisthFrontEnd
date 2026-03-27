import { useState, useEffect } from "react";
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
  const [strength, setStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");

  // Calculate Password Strength
  useEffect(() => {
    let score = 0;
    if (!passwordValue) return setStrength(0);
    if (passwordValue.length >= 8) score += 25;
    if (/[A-Z]/.test(passwordValue)) score += 25;
    if (/[0-9]/.test(passwordValue)) score += 25;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 25;
    setStrength(score);
  }, [passwordValue]);

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
                rules={{ required: "Password is required", minLength: 8 }}
              />

              {/* Strength Meter UI */}
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength <= 25
                      ? "bg-red-500"
                      : strength <= 50
                        ? "bg-orange-500"
                        : strength <= 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                  }`}
                  style={{ width: `${strength}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Password strength: {strength}%
              </p>

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
                    val === passwordValue || "Passwords do not match",
                }}
              />
            </div>
            <AuthButton type="submit" disabled={isSubmitting || strength < 50}>
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
