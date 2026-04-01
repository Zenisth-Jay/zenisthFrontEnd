import { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import Logo from "../components/Authentication/Logo";
import RightPanel from "../components/Authentication/RightPanel";
import InputElement from "../components/Authentication/InputElement";
import AuthButton from "../components/Authentication/AuthButton";
import { Mail, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const ForgotPass = () => {
  const [resetLinkSentToEmail, setResetLinkSentToEmail] = useState(null);

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

      setResetLinkSentToEmail(data.email?.trim() || "");
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

          {resetLinkSentToEmail !== null ? (
            <>
              <h1 className="mt-6 text-2xl sm:text-3xl font-normal text-[#212121]">
                Almost there
              </h1>
              <p className="text-[#9E9E9E] text-base sm:text-[18px] font-normal mb-6">
                Check your inbox to reset your password.
              </p>

              <div
                className="rounded-2xl border border-indigo-100 bg-white px-6 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-center"
                role="status"
                aria-live="polite"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 ring-8 ring-indigo-50/80">
                  <MailCheck
                    className="h-8 w-8 text-indigo-600"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </div>
                <h2 className="text-xl font-medium text-[#212121] mb-2">
                  Check your email
                </h2>
                <p className="text-[15px] leading-relaxed text-[#45556C] mb-1">
                  we&apos;ve sent a password reset link to{" "}
                  {resetLinkSentToEmail ? (
                    <span className="font-medium text-[#212121] break-all">
                      {resetLinkSentToEmail}
                    </span>
                  ) : (
                    "that address"
                  )}
                  . Open the message and use the link to choose a new password.
                </p>
                <p className="text-sm text-[#9E9E9E] mt-4 mb-6">
                  Didn&apos;t see it? Check your spam or promotions folder.
                </p>
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-3 text-base font-medium text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                >
                  Back to Login
                </Link>
              </div>

              <p className="text-center text-sm sm:text-[16px] text-[#45556C] mt-6">
                Wrong email?{" "}
                <button
                  type="button"
                  onClick={() => setResetLinkSentToEmail(null)}
                  className="text-indigo-500 font-medium hover:underline hover:text-indigo-700"
                >
                  Start over
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-4xl font-semibold text-[#212121] mt-6">
                Forgot Password? <span className="inline-block">🔒</span>
              </h1>
              <p className="text-[#9E9E9E] text-base sm:text-[18px] font-normal mb-6">
                Don&apos;t worry! It happens. Please enter the email associated
                with your account.
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
                  {isSubmitting ? "Sending..." : "Send reset link"}
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
            </>
          )}
        </div>
      </div>

      {/* Right */}
      <RightPanel />
    </div>
  );
};

export default ForgotPass;
