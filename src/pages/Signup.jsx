import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { KeyRound, Mail, User, UserRoundCog } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../supabase/supabaseClient";
import { FunctionsHttpError } from "@supabase/supabase-js";

// Components
import AuthButton from "../components/Authentication/AuthButton";
import InputElement from "../components/Authentication/InputElement";
import Logo from "../components/Authentication/Logo";
import RightPanel from "../components/Authentication/RightPanel";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Extract token from URL
  
  const [invitationData, setInvitationData] = useState(null);
  const [isValidating, setIsValidating] = useState(!!token);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  // 1. Validate Token on Mount
  useEffect(() => {
    if (token) {
      const validateToken = async () => {
        try {
          const { data, error } = await supabase.rpc("validate_invitation_token", {
            p_token: token,
          });

          if (error || !data[0]?.is_valid) {
            toast.error(data[0]?.error_message || "Invalid or expired invitation.");
            // Optional: Redirect away if token is invalid
            // navigate("/signup"); 
            return;
          }

          const info = data[0];
          setInvitationData(info);
          
          // Pre-fill and lock the email field
          setValue("email", info.invited_email);
        } catch (err) {
          toast.error("Failed to validate invitation.");
        } finally {
          setIsValidating(false);
        }
      };
      validateToken();
    }
  }, [token, setValue]);

  const onSignUp = async (data) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('sign-up-orchestrator', {
        body: { 
          email: data.email, 
          password: data.password, 
          fullName: data.fullName, 
          organizationName: token ? null : data.OrganizationName, // Only send if not an invite
          token: token || null // Send token if it exists
        },
      });

      if (error) {
        if (error instanceof FunctionsHttpError) {
          const errorDetails = await error.context.json();
          throw new Error(errorDetails.error || "Signup failed.");
        }
        throw new Error(error.message || "An unexpected error occurred.");
      }

      toast.success(token ? "Joined successfully! ✅" : "Account created successfully! ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(err.message);
    }
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) toast.error(firstError.message);
  };

  if (isValidating) {
    return <div className="min-h-screen flex items-center justify-center">Validating Invitation...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center bg-[#fafafa]">
      <div className="w-full lg:w-1/2 bg-[#fafafa] flex justify-center items-center p-4 sm:p-6 md:p-8 min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md flex flex-col animate-fade-in-up">
          <Logo />

          <h1 className="mt-4 text-2xl sm:text-3xl font-normal text-[#212121]">
            {token ? "Join Workspace 🚀" : "Get Started 🚀"}
          </h1>
          <p className="text-[#9E9E9E] text-base sm:text-[18px] font-normal mb-4">
            {token 
              ? `You've been invited to join ${invitationData?.org_name || "the organization"}.` 
              : "Create your account to unlock all features."}
          </p>

          <form onSubmit={handleSubmit(onSignUp, onError)} className="flex flex-col">
            <div className="flex flex-col gap-3 sm:gap-4 mb-5">
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
              />
            </div>

            <AuthButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : token ? "Join Organization" : "Sign Up"}
            </AuthButton>
          </form>

          <p className="text-center text-sm sm:text-[16px] text-[#45556C] mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-500 font-medium hover:underline hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <RightPanel />
    </div>
  );
};

export default Signup;
