import InputElement from "../../components/Authentication/InputElement";
import MainNavbar from "../../components/dashboard/MainNavbar";
import { useForm } from "react-hook-form";
import { FileText, Tag, Languages, AlignLeft, ChevronDown } from "lucide-react";
import SelectElement from "../../components/ui/SelectElement";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
];

const CreateTag = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Tag Form Data: ", data);
  };

  return (
    <>
      <MainNavbar />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Main Container */}
        <div className="w-full bg-gray-50 px-16 py-10 flex flex-col gap-6">
          {/* Create a new atg label ROW */}
          <div className="flex flex-col">
            <h1 className=" text-[40px] font-bold text-gray-900">
              Create New Tag
            </h1>
            <span className=" text-lg font-normal text-gray-700">
              Define rules for consistent translations
            </span>
          </div>

          {/* First Container */}
          <div className=" flex flex-col gap-6 bg-white border border-gray-300 p-10 rounded-2xl">
            {/* Row-1 */}
            <div className="flex gap-6 items-center">
              <InputElement
                label="Tag Name"
                name="tagName"
                type="text"
                placeholder="e.g. Legal Document - Formal"
                icon={Tag}
                register={register}
                className="w-[45%]"
              />

              <InputElement
                label="Tag Category"
                name="tagCategory"
                type="text"
                placeholder="e.g. Finance, Marketing etc..."
                icon={FileText}
                register={register}
                className="w-[45%]"
              />
            </div>

            {/* Descreption */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[#424242] text-[18px] font-medium">
                Description <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <AlignLeft size={22} strokeWidth={2} />
                </div>

                <textarea
                  {...register("description")}
                  placeholder="Describe the context, tone, and when to use this label..."
                  rows={4}
                  className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-2 gap-6">
              <SelectElement
                label="Source Language"
                name="sourceLanguage"
                register={register}
                options={LANGUAGES}
                placeholder="Select language"
              />

              <SelectElement
                label="Target Language"
                name="targetLanguage"
                register={register}
                options={LANGUAGES}
                placeholder="Select language"
              />
            </div>
          </div>

          {/* Glossary Card */}
          <div className="px-10 py-8 bg-white border border-gray-300 rounded-2xl flex flex-col">
            {/* Small Glossary section */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-semibold text-gray-900">Glossary</h2>
              <button
                type="button"
                className=" px-4 py-2 rounded-lg text-indigo-500 font-medium hover:text-indigo-900 cursor-pointer"
              >
                + Add Term
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-700 text-lg mb-4">
                No glossary terms added yet. Click ‘Add Term’ to get started.
              </p>

              <button
                type="button"
                className=" px-4 py-2 rounded-lg text-indigo-500 font-medium hover:text-indigo-900 cursor-pointer"
              >
                ? Sample Document
              </button>
            </div>
          </div>

          {/* Min div over */}
        </div>
      </form>
    </>
  );
};

export default CreateTag;
