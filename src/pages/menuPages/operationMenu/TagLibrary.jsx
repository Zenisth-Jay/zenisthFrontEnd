import { Briefcase, Plus, Star } from "lucide-react";
import MainNavbar from "../../../components/dashboard/MainNavbar";
import Button from "../../../components/ui/Button";
import { useMemo, useState } from "react";
import SearchBar from "../../../components/general/SearchBar";
import Tabs from "../../../components/general/Tabs";
import {
  useGetTagsQuery,
  useToggleFavoriteTagMutation,
} from "../../../api/tags.api";
import TranslationTag from "../../../components/tags/TranslationTag";
import { useNavigate } from "react-router-dom";

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

const TagLibrary = () => {
  const navigate = useNavigate();
  const { data: tags = [], isLoading, isError } = useGetTagsQuery();
  const [toggleFavoriteTag] = useToggleFavoriteTagMutation();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("company");

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
    <>
      <MainNavbar />
      <main className=" bg-gray-50 min-h-[calc(100vh-64px)] px-16 py-10 flex flex-col gap-10">
        <header className="flex flex-col gap-5">
          {/* Heading Section */}
          <div className=" w-full flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className=" text-2xl font-bold">Tag Library</h2>
              <p className=" text-xl font-normal text-gray-600">
                Manage your translation Tags and prompts.
              </p>
            </div>
            <Button
              leftIcon={<Plus />}
              onClick={() => navigate("/operations/translate/create-tag")}
            >
              Create new Tag
            </Button>
          </div>

          {/* Search Bar */}
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search your tag..."
          />
        </header>

        <Tabs tabs={TAG_TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className="w-full flex flex-wrap gap-6">
          {isLoading && <p>Loading tags...</p>}
          {isError && <p>Failed to load tags</p>}

          {!isLoading && filteredTags.length === 0 && (
            <p className="text-gray-600">No tags found for "{search}"</p>
          )}

          {filteredTags.map((tag) => (
            <TranslationTag
              key={tag.id}
              tag={tag}
              width={"w-82"}
              onToggleFavorite={(t) =>
                toggleFavoriteTag({ id: t.id, isFavorite: !t.isFavorite })
              }
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default TagLibrary;
