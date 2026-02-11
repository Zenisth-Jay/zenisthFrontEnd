import TranslatingAnimation from "../../components/animation/TranslatingAnimation";
import MainNavbar from "../../components/dashboard/MainNavbar";
import Stepper from "../../components/general/Stepper";
import { Languages, Eye, SquarePen, FileText } from "lucide-react";
import Button from "../../components/ui/Button";

const STEPS = ["Upload Document", "Select Tag", "Translation", "Review & Done"];

const Translating = () => {
  return (
    <>
      <MainNavbar />

      <main className="px-16 py-5 w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
        <Stepper steps={STEPS} activeStep={2} />

        <section className=" bg-white w-full h-full mt-5 px-12 py-3 flex flex-col flex-1 justify-between items-center rounded-3xl">
          {/* <Languages size={35} /> */}

          <TranslatingAnimation />

          <div className="flex flex-col gap-2 items-center">
            <h2 className=" text-5xl font-bold text-black">Translating....</h2>

            <p className=" text-gray-600 text-xl font-semibold">
              We are applying your custom instructions and translating the
              content. Please wait...
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className=" text-indigo-500 text-lg font-bold">English</span>
            <div className="w-10 h-10 rounded-full border border-gray-300 bg-white flex items-center justify-center ">
              <Languages
                size={22}
                strokeWidth={1.5}
                className=" text-indigo-600"
              />
            </div>
            <span className=" text-indigo-500 text-lg font-bold">Hebrew</span>
          </div>

          <div className="flex justify-between w-full">
            <Button
              variant="disable"
              className="w-[31%] shadow-sm"
              leftIcon={<Eye />}
            >
              Review Translation
            </Button>
            <Button
              leftIcon={<SquarePen className=" text-indigo-600" />}
              variant="outline"
              className="w-[31%] text-gray-600 shadow-sm"
            >
              Change Tag
            </Button>
            <Button leftIcon={<FileText />} className="w-[31%] shadow-sm">
              Upload Another Document
            </Button>
          </div>

          <div className="p-6 bg-gray-50 w-full rounded-3xl border border-indigo-200 shadow-md">
            <h2 className="text-2xl font-bold">What happens next?</h2>
            <p className=" text-lg font-normal text-gray-700">
              Once completed , you’ll be able to review translations, compare
              with the original, and download the final document. We’ll
              highlight suggested fixes and improvements.{" "}
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Translating;
