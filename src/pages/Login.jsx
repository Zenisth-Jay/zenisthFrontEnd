import Logo from "../components/Authentication/Logo";
import RightPanel from "../components/Authentication/RightPanel";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { KeyRound } from "lucide-react";
import InputElement from "../components/Authentication/InputElement";
import { Link } from "react-router-dom";
import AuthButton from "../components/Authentication/AuthButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginScema } from "../schemas/auth.schema";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { useLoginMutation } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({});

  const onSignIn = async (data) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      // Store session in Supabase client
      if (response?.access_token) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        });

        if (sessionError) {
          throw new Error(sessionError.message);
        }
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      console.error("Login error:", err);

      let message =
        err?.data?.msg ||
        err?.data?.error_description ||
        err?.data?.message ||
        err?.message ||
        "Login failed.";

      // Handle banned user
      if (message.toLowerCase().includes("banned")) {
        message = "Your account is deactivated. Please contact support.";
      }

      toast.error(message);
    }
  };

  // Add the missing onError handler to show validation errors to the user
  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left */}
      <div className="w-full lg:w-1/2 bg-[#fafafa] flex justify-center items-center p-4 sm:p-6 md:p-8 min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md animate-fade-in-up">
          <Logo />

          <h1 className="text-2xl sm:text-3xl font-normal text-[#212121] mt-4">
            Welcome Back <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-[#9E9E9E] text-base sm:text-[18px] font-normal mb-4">
            Sign in to continue managing your projects with ease.
          </p>

          {/* Google Login Button */}
          {/* <button
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 bg-white hover:bg-gray-50 mb-4 cursor-pointer
            active:scale-99 
            transition-all duration-200 ease-in-out 
            hover:shadow-sm
          "
          >
            <img src="/authentication/google_icon.svg" />
            <span className="font-medium text-gray-700">Login with Google</span>
          </button> */}

          {/* Divider */}
          {/* <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">Or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div> */}

          {/* Sign in Form */}

          <form
            onSubmit={handleSubmit(onSignIn, onError)}
            className="flex flex-col"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <InputElement
                label="Email"
                name="email"
                type="text"
                placeholder="Enter your email..."
                register={register}
                icon={Mail}
              />

              <InputElement
                label="Password"
                name="password"
                type="password"
                placeholder="*********"
                register={register}
                icon={KeyRound}
              />
            </div>

            <div className="flex justify-end px-1 sm:px-5 py-2 sm:py-2.5">
              <Link
                to="/forgot-password"
                className="text-indigo-500 text-sm sm:text-[16px] hover:underline hover:text-indigo-700 transition-colors"
              >
                Forgot Password ?
              </Link>
            </div>

            <AuthButton type="submit" disabled={isSubmitting || isLoggingIn}>
              {isSubmitting || isLoggingIn ? "Signing In..." : "Sign In"}
            </AuthButton>
          </form>

          <p className="text-center text-sm sm:text-[16px] text-[#45556C] mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-500 font-medium hover:underline hover:text-indigo-700"
            >
              Sign up
            </Link>
          </p>

          {/* end of this div here */}
        </div>
      </div>

      {/* Right */}
      <RightPanel />
    </div>
  );
};

export default Login;
