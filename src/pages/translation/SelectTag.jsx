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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUploads } from "../../redux/features/uploadSlice";
import { useStartTranslationMutation } from "../../api/translate.api";
import { useGetBatchSummaryQuery } from "../../api/batchSummary.api";

const SelectTag = () => {
  // fetch tool
  const { toolType } = useParams();
  const isIdp = toolType == "idp";

  // Stpes For the stepper : 1,2,3,4
  const STEPS = [
    "Upload Document",
    "Select Tag",
    isIdp ? "Extraction" : "Translation",
    "Review & Done",
  ];

  // Tabs of Tags
  const TAG_TABS = isIdp
    ? [
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
      ]
    : [
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

  // DATA FOR API
  const userId = "550e8400-e29b-41d4-a716-446655440000"; // later from auth
  const application = isIdp ? "IDP" : "TRANSLATE";
  const organizationId = "7b2f5a9c-3c3e-4e9c-8d4b-1c7f9b123456"; // later from auth/store
  const applicationId = isIdp ? "IDP" : "TRANSLATION";

  // NAVIGATE AND DISPATCH VARS
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // FETCH TAGS DATA FROM API
  const {
    data: tags = [],
    isLoading,
    isError,
  } = useGetTagsQuery({ organizationId, applicationId });

  // FETCH FUNCTION TO FAVIOURITE TAG
  const [toggleFavoriteTag] = useToggleFavoriteTagMutation();

  // STATES
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("company");
  const [selectedTag, setSelectedTag] = useState(null);

  const [startTranslation, { isLoading: isTranslating }] =
    useStartTranslationMutation();

  const { files: uploadedFiles, hasCompletedBatch } = useSelector(
    (state) => state.upload,
  );

  const {
    data: batchSummary,
    isLoading: isBatchLoading,
    isError: isBatchError,
  } = useGetBatchSummaryQuery(
    { application, userId },
    { skip: !hasCompletedBatch }, // only fetch after uploads complete
  );

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
              {isIdp
                ? "Choose a tag from your favorites or company tags"
                : "Select a tag to apply translation rules, tone, and glossary."}
            </p>
          </div>
          <Button
            leftIcon={<Plus size={22} className=" text-white" />}
            onClick={() =>
              navigate(`/operations/${isIdp ? "idp" : "translate"}/create-tag`)
            }
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
        <div className=" w-full flex gap-3">
          {/* Left Tag container */}
          <div className="w-[66.66%] max-h-[calc(100vh-280px)] overflow-y-auto flex flex-wrap gap-6">
            {isLoading && <p>Loading tags...</p>}
            {isError && <p>Failed to load tags</p>}

            {!isLoading && filteredTags.length === 0 && (
              <p className="text-gray-600">No tags found for "{search}"</p>
            )}

            {filteredTags.map((tag) => (
              <TranslationTag
                key={tag.id}
                tag={tag}
                width={"w-[47%]"}
                isSelected={selectedTag?.id === tag.id}
                onSelect={(t) => setSelectedTag(t)}
                onToggleFavorite={(t) =>
                  toggleFavoriteTag({ id: t.id, isFavorite: !t.isFavorite })
                }
                idp={isIdp}
              />
            ))}
          </div>
          {/* Right batch summary container */}
          <div className=" w-[33.33%] h-fit border flex flex-col gap-4 items-start p-6 rounded-2xl border-gray-300 bg-white">
            <h2 className=" text-2xl text-gray-900 font-semibold">
              Batch Summary
            </h2>
            {hasCompletedBatch ? (
              <>
                {isBatchLoading && <p>Calculating credits...</p>}
                {isBatchError && (
                  <p className="text-red-500">Failed to load batch summary</p>
                )}

                {batchSummary && (
                  <>
                    <div className=" w-full flex justify justify-between">
                      <span className=" text-xl text-gray-700">
                        Document Uploaded
                      </span>
                      <span className="text-gray-800 text-2xl font-bold">
                        {batchSummary?.total_documents ?? "refresh"}
                      </span>
                    </div>
                    <div className="w-full flex justify justify-between">
                      <span className=" text-xl text-gray-700">
                        {isIdp
                          ? "Total pages detected"
                          : "Total Characters detected"}
                      </span>
                      <span className="text-gray-800 text-2xl font-semibold">
                        {batchSummary.total_count
                          ? batchSummary.total_count
                          : "refresh"}
                      </span>
                    </div>

                    <hr className=" w-full text-gray-300" />

                    <div className="w-full flex flex-col gap-5">
                      <h3 className="text-xl text-gray-900 font-semibold">
                        {`${isIdp ? "Extraction" : "Translation"} Credits`}
                      </h3>

                      <div className="flex items-center justify-between">
                        {/* Left side: dot + formula */}
                        <div className=" pl-1 flex items-center gap-3 text-gray-600 text-[16px]">
                          {/* Custom bullet */}
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-600 inline-block" />

                          {/* Formula */}
                          <div className="flex items-center text-gray-600 gap-1.5">
                            <span>
                              {batchSummary?.total_count ?? "refresh"}
                            </span>
                            <span>÷</span>
                            <span>{batchSummary?.unit_size ?? "refresh"}</span>
                            <span>×</span>
                            <span>
                              {batchSummary?.credits_per_unit ?? "refresh"}
                            </span>
                          </div>
                        </div>

                        {/* Right side: result */}
                        <span className="text-gray-900 font-medium text-[16px]">
                          {batchSummary?.total_credits ?? "refresh"} Credits
                        </span>
                      </div>
                    </div>

                    <hr className=" w-full text-gray-300" />

                    <div className="flex w-full justify-between items-center">
                      <h2 className=" text-xl font-semibold text-gray-900">
                        Total Credits :
                      </h2>
                      <span className="text-xl font-bold text-gray-800">
                        {batchSummary?.total_credits ?? "refresh"} Credits
                      </span>
                    </div>

                    <div className="w-full flex justify-between mt-2">
                      <Button
                        variant="outline"
                        className="w-[47%]"
                        onClick={() => {
                          dispatch(clearUploads()); // reset batch
                          navigate(
                            `/operations/${isIdp ? "idp" : "translate"}`,
                          ); // or your upload page
                        }}
                      >
                        Back
                      </Button>

                      {/* <Button
                    className="w-[47%]"
                    disabled={!selectedTag}
                    onClick={() => {
                      dispatch(clearUploads()); // ✅ clear batch ONLY here
                      navigate("/operations/translate/translating"); // or next step
                    }}
                  >
                    Start Translation
                  </Button> */}

                      <Button
                        className="w-[47%]"
                        disabled={!selectedTag || isTranslating}
                        onClick={async () => {
                          try {
                            const res = await startTranslation({
                              tagId: selectedTag.id,
                            }).unwrap();

                            console.log(
                              `${isIdp ? "Extraction" : "Translation"} started ✅`,
                              res,
                            );
                            const { jobId, status } = res;

                            // clear batch only AFTER successful call
                            dispatch(clearUploads());

                            // go to translating screen
                            navigate(
                              `/operations/${isIdp ? "idp" : "Translate"}/${isIdp ? "extracting" : "translating"}?jobId=${jobId}`,
                            );
                          } catch (err) {
                            console.error(
                              `Failed to start ${isIdp ? "Extraction" : "Translation"} ❌`,
                              err,
                            );
                            alert(
                              `Failed to start ${isIdp ? "Extraction" : "Translation"}. Please try again.`,
                            );
                          }
                        }}
                      >
                        {isTranslating
                          ? "Starting..."
                          : `Start ${isIdp ? "Extraction" : "Translation"}`}
                      </Button>
                    </div>

                    <div
                      className=" w-full  p-4 pl-7 mt-2 rounded-lg text-lg font-medium border border-indigo-200 bg-indigo-50 text-gray-700
              shadow-[0_1px_2px_0_rgba(0,0,0,0.30),0_2px_6px_2px_rgba(0,0,0,0.15)]
              "
                    >
                      💡 {batchSummary.credits_per_unit} credit ={" "}
                      {batchSummary.unit_size}{" "}
                      {`${isIdp ? "page" : "characters"}`}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div>
                  <p>Please wait while uploading your documents.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SelectTag;
