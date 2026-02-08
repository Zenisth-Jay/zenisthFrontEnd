import MainNavbar from "../../components/dashboard/MainNavbar";
import Stepper from "../../components/general/Stepper";
import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import SearchBar from "../../components/general/SearchBar";
import { useMemo, useState } from "react";
import Tabs from "../../components/general/Tabs";
import { Star, Briefcase, Bookmark } from "lucide-react";
import TranslationTag from "../../components/tags/TranslationTag";
import {
  useGetTagsQuery,
  useToggleFavoriteTagMutation,
} from "../../api/tags.api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const { data: tags = [], isLoading, isError } = useGetTagsQuery();
  const [toggleFavoriteTag] = useToggleFavoriteTagMutation();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("company");
  const [selectedTag, setSelectedTag] = useState(null);

  // Filtering
  const filteredTags = useMemo(() => {
    let result = tags;

    // 1️⃣ Filter by active tab
    if (activeTab === "my") {
      result = result.filter((tag) => tag.isFavorite === true);
    } else if (activeTab === "default") {
      result = result.filter((tag) => tag.isDefault === true);
    } else if (activeTab === "company") {
      // Company tags = not default (you can adjust this rule if backend changes)
      result = result.filter((tag) => tag.isDefault === false);
    }

    // 2️⃣ Filter by search
    if (!search.trim()) return result;

    const q = search.toLowerCase();

    return result.filter((tag) => {
      return (
        tag.name?.toLowerCase().includes(q) ||
        tag.description?.toLowerCase().includes(q) ||
        tag.sourceLanguage?.toLowerCase().includes(q) ||
        tag.targetLanguage?.toLowerCase().includes(q)
      );
    });
  }, [tags, search, activeTab]);

  return (
    <div>
      <MainNavbar />

      <section className=" px-16 py-5 flex flex-col gap-4">
        {/* Stpes */}
        <Stepper steps={STEPS} activeStep={1} />

        {/* Heading Text and butoon */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <h2 className=" text-4xl font-bold text-gray-800">Select Tag</h2>
            <p className=" text-gray-700 font-normal text-lg">
              Select a tag to apply translation rules, tone, and glossary.
            </p>
          </div>
          <Button
            leftIcon={<Plus size={22} className=" text-white" />}
            onClick={() => navigate("/operations/translate/create-tag")}
          >
            Create new Tag
          </Button>
        </div>

        {/* Search Bars */}
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search your tag..."
        />

        {/* Tabs */}
        <Tabs tabs={TAG_TABS} activeTab={activeTab} onChange={setActiveTab} />

        {/* last Div containing tags and Batch summary container */}
        <div className=" w-full flex">
          {/* Left Tag container */}
          <div className="w-[66.66%] h-fit flex flex-wrap gap-6">
            {isLoading && <p>Loading tags...</p>}
            {isError && <p>Failed to load tags</p>}

            {!isLoading && filteredTags.length === 0 && (
              <p className="text-gray-600">No tags found for "{search}"</p>
            )}

            {filteredTags.map((tag) => (
              <TranslationTag
                key={tag.id}
                tag={tag}
                isSelected={selectedTag?.id === tag.id}
                onSelect={(t) => setSelectedTag(t)}
                onToggleFavorite={(t) =>
                  toggleFavoriteTag({ id: t.id, isFavorite: !t.isFavorite })
                }
              />
            ))}
          </div>

          {/* Right batch summary container */}
          <div className=" w-[33.33%] border flex flex-col gap-3 items-start p-6 rounded-2xl border-gray-300 bg-white">
            <h2 className=" text-2xl text-gray-900 font-semibold">
              Batch Summary
            </h2>
            <div className="flex flex-col">
              <span className=" text-xl text-gray-700">Document detected</span>
              <span className="text-gray-800 text-2xl font-bold">6</span>
            </div>
            <div className="flex flex-col">
              <span className=" text-xl text-gray-700">Language detected</span>
              <span className="text-gray-800 text-2xl font-semibold">
                English
              </span>
            </div>

            <hr className=" w-full text-gray-300" />

            <div className=" w-full flex flex-col gap-3">
              <h3 className=" text-xl text-gray-900 font-medium">
                Estimated Credits
              </h3>
              <ul className=" list-disc list-inside">
                <li className=" w-full flex items-center justify-between">
                  <span className=" text-gray-600 text-[16px]">
                    Translation :
                  </span>
                  <span className=" text-gray-900 font-semibold text-[16px]">
                    5 Credits
                  </span>
                </li>
              </ul>
            </div>

            <hr className=" w-full text-gray-300" />

            <div className="flex w-full justify-between items-center">
              <h2 className=" text-xl font-semibold text-gray-900">
                Total Estimated :{" "}
              </h2>
              <span className="text-xl font-semibold text-gray-800">
                5 Credits
              </span>
            </div>

            <div className="w-full flex justify-between mt-2">
              <Button variant="outline" className="w-[47%]">
                Back
              </Button>
              <Button className="w-[47%]" disabled={!selectedTag}>
                Start Translation
              </Button>
            </div>

            <div
              className="p-4 mt-2 rounded-lg text-lg font-medium border border-indigo-200 bg-indigo-50 text-gray-700
            shadow-[0_1px_2px_0_rgba(0,0,0,0.30),0_2px_6px_2px_rgba(0,0,0,0.15)]
            "
            >
              Final credit usage may vary slightly depending on document length
              and formatting.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectTag;
