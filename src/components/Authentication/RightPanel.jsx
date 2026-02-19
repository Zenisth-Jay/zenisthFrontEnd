import { memo } from "react";

const RightPanel = () => {
  return (
    <div className="hidden lg:block lg:w-1/2 relative h-screen overflow-hidden">
      {/* Background */}
      <div className=" w-full h-full bg-auth bg-cover bg-center absolute inset-0 z-0" />

      {/* content container */}
      <div className="flex flex-col justify-center items-center text-center relative h-full z-10 px-4 sm:px-6 lg:px-12">
        <img
          src="/authentication/auth_design.png"
          alt=""
          className="w-full max-w-[85%] sm:max-w-95.5 xl:max-w-110 h-auto z-20 mb-6 lg:mb-8 animate-fade-in"
        />
        <div className="max-w-110 text-white">
          <h2 className="text-2xl sm:text-[32px] xl:text-[40px] font-bold leading-tight xl:leading-12 tracking-[0.75px] font-nunito">
            One Platform, Infinite Possibilities
          </h2>
        </div>
        <p className="mt-4 sm:mt-6 text-light-white font-medium leading-tight xl:leading-8 text-base sm:text-lg xl:text-[24px] max-w-[90%] xl:max-w-150">
          Manage all your AI tools in one unified workspace. <br /> Streamline
          your workflow with Zenisth AI.
        </p>
      </div>
    </div>
  );
};

export default memo(RightPanel);
