import { useNavigate } from "react-router-dom";
import AuthButton from "../components/Authentication/AuthButton";
import InputElement from "../components/Authentication/InputElement";
import Logo from "../components/Authentication/Logo";
import RightPanel from "../components/Authentication/RightPanel";
import { useForm } from "react-hook-form";
import { KeyRound, Mail, User, UserRoundCog } from "lucide-react";
import { Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(loginScema),
  });

  const onSignIn = (data) => {
    toast.success("Login successful ✅");

    setTimeout(() => {
      navigate("/dashboard");
    }, 100);
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return (
    <div className=" min-h-screen flex items-center bg-[#fafafa] ">
      {/* Left */}
      <div className="w-full lg:w-1/2 bg-[#fafafa] flex justify-center items-center p-8 ">
        <div className="w-full max-w-md flex flex-col">
          <Logo />

          {/* Welcome Text */}
          <h1 className=" mt-4 text-3xl font-normal text-[#212121] ">
            Get Started 🚀
          </h1>
          <p className="text-[#9E9E9E] text-[18px] font-normal mb-4">
            Create your account to unlock all features.
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
            <span className="font-medium text-gray-700">
              SignUp with Google
            </span>
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
              />

              <InputElement
                label="Organization name"
                name="OrganizationName"
                type="text"
                placeholder="Enter your Organization name..."
                register={register}
                icon={UserRoundCog}
              />

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

            <AuthButton type="submit">Sign Up</AuthButton>
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

          {/* end of this div here */}
        </div>
      </div>

      {/* Right */}
      <RightPanel />
    </div>
  );
};

export default Signup;
