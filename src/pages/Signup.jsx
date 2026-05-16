import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { KeyRound, Mail, MailCheck, User, UserRoundCog } from "lucide-react";
import { toast } from "react-toastify";
import AuthButton from "../components/Authentication/AuthButton";
import InputElement from "../components/Authentication/InputElement";
import Logo from "../components/Authentication/Logo";
import RightPanel from "../components/Authentication/RightPanel";
import {
  useSignUpMutation,
  useValidateInvitationMutation,
} from "../api/auth.api";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract token from URL

  const [invitationData, setInvitationData] = useState(null);
  const [isValidating, setIsValidating] = useState(!!token);
  /** Set after successful self-serve signup when the server emails a completion link */
  const [signupLinkSentToEmail, setSignupLinkSentToEmail] = useState(null);
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();
  const [validateInvitation] = useValidateInvitationMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm();

  // 1. Validate Token on Mount
  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        try {
          const response = await validateInvitation({
            token,
          }).unwrap();

          const info = response?.[0];

          if (!info?.is_valid) {
            const serverMsg =
              info?.error_message || "Invalid or expired invitation.";

            toast.error(serverMsg);
            setIsValidating(false);
            return;
          }

          setInvitationData(info);

          // Pre-fill and lock the email field
          setValue("email", info.invited_email);
        } catch (err) {
          console.error("Token validation error:", err);

          const message =
            err?.data?.error ||
            err?.data?.message ||
            err?.message ||
            "Failed to validate invitation.";

          toast.error(message);
        } finally {
          setIsValidating(false);
        }
      };

      validateToken();
    }
  }, [token, setValue, validateInvitation]);

  const onSignUp = async (data) => {
    try {
      const response = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        organizationName: token ? null : data.OrganizationName,
        token: token || null,
      }).unwrap();

      // ✅ Success
      if (token) {
        toast.success("Joined successfully! ✅");

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      setSignupLinkSentToEmail(data.email?.trim() || "");
    } catch (err) {
      console.error("Signup error:", err);

      const message =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        "Something went wrong.";

      toast.error(message);
    }
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    // if (firstError?.message) toast.error(firstError.message);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Validating Invitation...
      </div>
    );
  }

  return (
    <div className=" min-h-screen flex items-center bg-[#fafafa] ">
      <div className="w-full lg:w-1/2 bg-[#fafafa] flex justify-center items-center p-8 ">
        <div className="w-full max-w-md flex flex-col">
          <Logo />

          {signupLinkSentToEmail !== null ? (
            <>
              <h1 className="mt-4 text-3xl font-normal text-[#212121]">
                Almost there
              </h1>
              <p className="text-[#9E9E9E] text-[18px] font-normal mb-6">
                One more step in your inbox.
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
                  We&apos;ve sent a signup link to{" "}
                  {signupLinkSentToEmail ? (
                    <span className="font-medium text-[#212121] break-all">
                      {signupLinkSentToEmail}
                    </span>
                  ) : (
                    "the address you entered"
                  )}
                  . Open the message and tap the link to finish setting up your
                  account, it only takes a moment.
                </p>
                <p className="text-sm text-[#9E9E9E] mt-4 mb-6">
                  Didn&apos;t see it? Check your spam or promotions folder.
                </p>
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-3 text-base font-medium text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
                >
                  Back to sign in
                </Link>
              </div>

              <p className="text-center text-[16px] text-[#45556C] mt-6">
                Wrong email?{" "}
                <button
                  type="button"
                  onClick={() => setSignupLinkSentToEmail(null)}
                  className="text-indigo-500 font-medium hover:underline hover:text-indigo-700"
                >
                  Start over
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className=" mt-4 text-3xl font-normal text-[#212121] ">
                {token ? "Join Workspace 🚀" : "Get Started 🚀"}
              </h1>
              <p className="text-[#9E9E9E] text-[18px] font-normal mb-4">
                {token
                  ? `You've been invited to join ${invitationData?.org_name || "the organization"}.`
                  : "Create your account to unlock all features."}
              </p>

              <form
                onSubmit={handleSubmit(onSignUp, onError)}
                className=" flex flex-col"
              >
                <div className="flex flex-col gap-4 mb-5">
                  <InputElement
                    label="Full name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your Full name..."
                    register={register}
                    icon={User}
                    required
                  />

                  {/* Hide Organization Name if it's an Invite flow */}
                  {!token && (
                    <InputElement
                      label="Organization name"
                      name="OrganizationName"
                      type="text"
                      placeholder="Enter your Organization name..."
                      register={register}
                      icon={UserRoundCog}
                      required
                    />
                  )}

                  <InputElement
                    label="Email"
                    name="email"
                    type="text"
                    placeholder="Enter your email..."
                    register={register}
                    icon={Mail}
                    required
                    disabled={!!token}
                    readOnly={!!token} // Prevent changing email if invited
                    className={token ? "bg-gray-100 cursor-not-allowed" : ""}
                  />

                  <InputElement
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="*********"
                    register={register}
                    icon={KeyRound}
                    required
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
                    Use 8+ characters with uppercase, lowercase, number, and
                    special character.
                  </p>
                  {errors.password?.message && (
                    <p className="text-sm text-red-600 -mt-2">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <AuthButton type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Processing..."
                    : token
                      ? "Join Organization"
                      : "Sign Up"}
                </AuthButton>
              </form>

              <p className="text-center text-[16px] text-[#45556C] mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-500 font-medium hover:underline hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      <RightPanel />
    </div>
  );
};

export default Signup;
