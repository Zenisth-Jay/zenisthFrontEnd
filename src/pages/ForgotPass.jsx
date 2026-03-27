import { supabase } from "../supabase/supabaseClient";
import Logo from "../components/Authentication/Logo";
import RightPanel from "../components/Authentication/RightPanel";
import InputElement from "../components/Authentication/InputElement";
import AuthButton from "../components/Authentication/AuthButton";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ForgotPass = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        // Points to your ChangePassword route
        redirectTo: `https://dv6j5qb9g974j.cloudfront.net/change-password`,
      });

      if (error) throw error;

      // Generic message regardless of whether email exists
      toast.success(
        "If an account exists with that email, a password reset link has been sent.",
      );
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left */}
      <div className="w-full lg:w-1/2 bg-[#fafafa] flex justify-center items-center p-4 sm:p-6 md:p-8 min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md animate-fade-in-up">
          <Logo />

          <h1 className="text-2xl sm:text-4xl font-semibold text-[#212121] mt-6">
            Forgot Password? <span className="inline-block">🔒</span>
          </h1>
          <p className="text-[#9E9E9E] text-base sm:text-[18px] font-normal mb-6">
            Don&apos;t worry! It happens. Please enter the email associated with
            your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-3 sm:gap-4 mb-4">
              <InputElement
                label="Enter your email"
                name="email"
                type="email"
                placeholder="Enter your email..."
                register={register}
                icon={Mail}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                }}
              />
            </div>

            <AuthButton type="submit" disabled={isSubmitting}>
              Sent Reset Link
            </AuthButton>
          </form>

          <p className="text-center text-sm sm:text-[16px] text-[#45556C] mt-2">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-indigo-500 font-medium hover:underline hover:text-indigo-700"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right */}
      <RightPanel />
    </div>
  );
};

export default ForgotPass;
