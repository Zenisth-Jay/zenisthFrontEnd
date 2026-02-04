import MainNavbar from "../../components/dashboard/MainNavbar";
import Stepper from "../../components/general/Stepper";
import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/general/SearchBar";
import { useState } from "react";
import Tabs from "../../components/general/Tabs";
import { Star, Briefcase, Bookmark } from "lucide-react";
import TranslationTag from "../../components/tags/TranslationTag";

const STEPS = ["Upload Document", "Select Tag", "Translation", "Review & Done"];

const TAG_TABS = [
  {
    label: "My Tags",
    id: "my",
    icon: Star,
    iconClassName: "text-[#FBC02D]",
    iconFill: true,
  },
  {
    label: "Company Tags",
    id: "company",
    icon: Briefcase,
    iconClassName: "text-gray-800",
    iconFill: false,
  },
  {
    label: "Default Tags",
    id: "default",
    icon: Star,
    iconClassName: "text-gray-800",
    iconFill: false,
  },
];

const SelectTag = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div>
      <MainNavbar />

      <section className=" px-16 py-5 flex flex-col gap-4">
        <Stepper steps={STEPS} activeStep={1} />

        <div className="mt-5 flex items-center justify-between">
          <div>
            <h2 className=" text-4xl font-bold text-gray-800">Select Tag</h2>
            <p className=" text-gray-700 font-normal text-lg">
              Select a tag to apply translation rules, tone, and glossary.
            </p>
          </div>
          <Button leftIcon={<Plus size={22} className=" text-white" />}>
            Create new Tag
          </Button>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search your tag..."
        />

        <Tabs tabs={TAG_TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className=" w-full flex">
          {/* Left Tag container */}
          <div className="w-[60%] flex flex-wrap gap-6">
            <TranslationTag />
            <TranslationTag />
            <TranslationTag />
            <TranslationTag />
          </div>
          {/* Right batch summary container */}
          <div className=" w-[40%] border flex items-center justify-center">
            <Button>Start Translation</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectTag;
