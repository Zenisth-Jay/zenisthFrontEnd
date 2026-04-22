import { useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  FileText,
  PencilLine,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import MainNavbar from "../../components/dashboard/MainNavbar";
import Stepper from "../../components/general/Stepper";
import Button from "../../components/ui/Button";
import reviewData from "../../data/translateErrors.json";
import { Pill } from "../../components/ui/Pill";

const STEPS = ["Upload Document", "Select Tag", "Translation", "Review & Done"];

const FILE_NAME = "Legal_contract_FR.pdf";
const SOURCE_LANGUAGE = "EN";
const TARGET_LANGUAGE = "HB";
const INDUSTRY = "Legal";

const severityTheme = {
  Critical: {
    pill: "border-red-200 bg-red-50 text-red-700",
    badge: "border-red-200 bg-red-50 text-red-700",
    card: "border-red-200 bg-red-50/80",
    highlight: "bg-red-100 text-red-700 ring-1 ring-red-200",
  },
  Minor: {
    pill: "border-amber-200 bg-amber-50 text-amber-700",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    card: "border-amber-200 bg-amber-50/80",
    highlight: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  },
  Changed: {
    pill: "border-sky-200 bg-sky-50 text-sky-700",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    card: "border-sky-200 bg-sky-50/80",
    highlight: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
  },
};

const deepClone = (value) => JSON.parse(JSON.stringify(value));

const prepareDocument = (data) => {
  const next = deepClone(data);

  next.chunks = (next.chunks || []).map((chunk) => ({
    ...chunk,
    mqm_result: {
      ...chunk.mqm_result,
      errors: (chunk.mqm_result?.errors || []).map((error, index) => ({
        ...error,
        id: `${chunk.chunk_id}-error-${index}`,
        isSuggestionUsed: Boolean(error.isSuggestionUsed),
        originalSeverity: error.originalSeverity || error.severity,
        original_text: error.original_text || "",
      })),
    },
  }));

  return next;
};

const normalizeListItems = (text = "") =>
  text
    .split("\n")
    .map((item) => item.replace(/^\*\s*/, "").trim())
    .filter(Boolean);

const denormalizeListItems = (items = []) =>
  items.map((item) => `* ${item.trim()}`).join("\n");

const replaceFirstOccurrence = (text, target, replacement) => {
  if (!target || !text.includes(target)) return text;
  return text.replace(target, replacement);
};

const extractChangedSegment = (
  previousText = "",
  nextText = "",
  target = "",
) => {
  if (!target) return "";

  const targetStart = previousText.indexOf(target);
  if (targetStart === -1) return "";

  const before = previousText.slice(0, targetStart);
  const after = previousText.slice(targetStart + target.length);

  if (
    nextText.startsWith(before) &&
    nextText.endsWith(after) &&
    nextText.length >= before.length + after.length
  ) {
    return nextText.slice(before.length, nextText.length - after.length).trim();
  }

  let prefix = 0;
  const minLen = Math.min(previousText.length, nextText.length);
  while (prefix < minLen && previousText[prefix] === nextText[prefix]) {
    prefix += 1;
  }

  let suffix = 0;
  while (
    suffix < previousText.length - prefix &&
    suffix < nextText.length - prefix &&
    previousText[previousText.length - 1 - suffix] ===
      nextText[nextText.length - 1 - suffix]
  ) {
    suffix += 1;
  }

  return nextText.slice(prefix, nextText.length - suffix).trim();
};

const getWordsCount = (chunks = []) =>
  chunks.reduce((total, chunk) => {
    const words = chunk.translated_chunk.reduce((count, block) => {
      const blockWordCount = block.text
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      return count + blockWordCount;
    }, 0);

    return total + words;
  }, 0);

const normalizeFileName = (value = "translated_document") =>
  value
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase() || "translated_document";

const renderHighlightedText = (
  text,
  highlights,
  activeErrorId,
  onHighlightClick,
  registerHighlightRef,
) => {
  if (!highlights.length || !text) {
    return text;
  }

  const orderedHighlights = [...highlights].sort(
    (first, second) => first.start - second.start,
  );

  const pieces = [];
  let cursor = 0;

  orderedHighlights.forEach((highlight, index) => {
    if (highlight.start > cursor) {
      pieces.push(text.slice(cursor, highlight.start));
    }

    const theme = severityTheme[highlight.severity] || severityTheme.Minor;

    pieces.push(
      <span
        key={`${highlight.id}-${index}`}
        ref={(element) => registerHighlightRef?.(highlight.id, element)}
        className={`rounded px-1 py-0.5 transition ${
          theme.highlight
        } ${activeErrorId === highlight.id ? "shadow-sm" : ""} ${
          onHighlightClick ? "cursor-pointer" : ""
        }`}
        onClick={() => onHighlightClick?.(highlight.id)}
      >
        {text.slice(highlight.start, highlight.end)}
      </span>,
    );

    cursor = highlight.end;
  });

  if (cursor < text.length) {
    pieces.push(text.slice(cursor));
  }

  return pieces;
};

const ReviewTranslation = () => {
  const [documentState, setDocumentState] = useState(() =>
    prepareDocument(reviewData),
  );
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [manualEdit, setManualEdit] = useState(false);
  const [showOnlyMandatory, setShowOnlyMandatory] = useState(false);
  const [activeErrorId, setActiveErrorId] = useState(null);
  const errorCardRefs = useRef({});
  const highlightRefs = useRef({});

  const chunks = documentState.chunks || [];
  const currentChunk = chunks[currentChunkIndex];

  const filteredErrors = useMemo(() => {
    const errors = currentChunk?.mqm_result?.errors || [];
    return showOnlyMandatory
      ? errors.filter((error) => error.severity === "Critical")
      : errors;
  }, [currentChunk, showOnlyMandatory]);

  const activeError = useMemo(() => {
    if (!filteredErrors.length) return null;
    return (
      filteredErrors.find((error) => error.id === activeErrorId) ||
      filteredErrors[0]
    );
  }, [activeErrorId, filteredErrors]);

  const currentTranslatedBlocks = currentChunk?.translated_chunk || [];

  const blockHighlights = useMemo(() => {
    const map = {};

    filteredErrors.forEach((error) => {
      const blockIndex = error.error_location_index;
      const block = currentTranslatedBlocks[blockIndex];

      if (!block?.text || !error.problematic_text) return;

      const start = block.text.indexOf(error.problematic_text);
      if (start === -1) return;

      if (!map[blockIndex]) {
        map[blockIndex] = [];
      }

      map[blockIndex].push({
        id: error.id,
        severity: error.severity,
        start,
        end: start + error.problematic_text.length,
      });
    });

    return map;
  }, [currentTranslatedBlocks, filteredErrors]);

  const totalIssues = chunks.length;
  const totalWords = getWordsCount(chunks);
  const criticalCount = currentChunk?.mqm_result?.summary?.critical_errors || 0;
  const minorCount = currentChunk?.mqm_result?.summary?.minor_errors || 0;
  const score = currentChunk?.mqm_result?.score || 0;

  const ensureActiveError = (errors) => {
    if (!errors.length) {
      setActiveErrorId(null);
      return;
    }

    setActiveErrorId((currentId) =>
      errors.some((error) => error.id === currentId) ? currentId : errors[0].id,
    );
  };

  const updateChunk = (updater) => {
    setDocumentState((previous) => {
      const next = deepClone(previous);
      updater(next.chunks[currentChunkIndex]);
      return next;
    });
  };

  const rebuildSummary = (chunk) => {
    const errors = (chunk.mqm_result.errors || []).filter(
      (error) => !error.isSuggestionUsed,
    );
    chunk.mqm_result.summary = {
      critical_errors: errors.filter((error) => error.severity === "Critical")
        .length,
      minor_errors: errors.filter((error) => error.severity !== "Critical")
        .length,
    };
  };

  const markResolvedErrorsAsChangedForBlock = (
    chunk,
    blockIndex,
    previousText = "",
    nextText = "",
  ) => {
    chunk.mqm_result.errors = (chunk.mqm_result.errors || []).map((error) => {
      if (error.error_location_index !== blockIndex) {
        return error;
      }

      const problematicText = (error.problematic_text || "").trim();
      if (!problematicText) return error;

      const existedBefore = previousText.includes(problematicText);
      const existsNow = nextText.includes(problematicText);
      if (!existedBefore) {
        return error;
      }

      const changedSegment = extractChangedSegment(
        previousText,
        nextText,
        problematicText,
      );
      const hasMeaningfulChange =
        Boolean(changedSegment) && changedSegment !== problematicText;

      if (!hasMeaningfulChange && existsNow) {
        return error;
      }

      return {
        ...error,
        original_text: error.original_text || problematicText,
        problematic_text: changedSegment || problematicText,
        isSuggestionUsed: true,
        originalSeverity: error.originalSeverity || error.severity,
        severity: "Changed",
      };
    });

    rebuildSummary(chunk);
  };

  const handleJumpToChunk = (event) => {
    setCurrentChunkIndex(Number(event.target.value));
    setActiveErrorId(null);
  };

  const handleApplySuggestion = (error, suggestion) => {
    updateChunk((chunk) => {
      const blockIndex = error.error_location_index;
      const block = chunk.translated_chunk[blockIndex];

      if (!block) return;

      const previousProblematicText = error.problematic_text;
      block.text = replaceFirstOccurrence(
        block.text,
        previousProblematicText,
        suggestion,
      );

      chunk.mqm_result.errors = (chunk.mqm_result.errors || []).map((item) => {
        if (item.id !== error.id) return item;

        const nextSuggestions = [
          previousProblematicText,
          ...(item.suggestions || []).filter(
            (candidate) => candidate !== suggestion,
          ),
        ].filter(Boolean);

        return {
          ...item,
          problematic_text: suggestion,
          suggestions: [...new Set(nextSuggestions)],
          isSuggestionUsed: true,
          originalSeverity: item.originalSeverity || item.severity,
          original_text:
            item.severity === "Critical" || item.severity === "Minor"
              ? item.original_text || previousProblematicText
              : item.original_text || "",
          severity: "Changed",
        };
      });
      rebuildSummary(chunk);
    });
  };

  const handleTextBlockChange = (blockIndex, value) => {
    updateChunk((chunk) => {
      const block = chunk.translated_chunk[blockIndex];
      if (!block) return;

      const previousText = block.text || "";
      block.text = value;
      markResolvedErrorsAsChangedForBlock(
        chunk,
        blockIndex,
        previousText,
        value,
      );
    });
  };

  const handleListItemChange = (blockIndex, itemIndex, value) => {
    updateChunk((chunk) => {
      const block = chunk.translated_chunk[blockIndex];
      if (!block) return;

      const previousText = block.text || "";
      const items = normalizeListItems(block.text);
      items[itemIndex] = value;
      const nextText = denormalizeListItems(items);
      block.text = nextText;
      markResolvedErrorsAsChangedForBlock(
        chunk,
        blockIndex,
        previousText,
        nextText,
      );
    });
  };

  const handleDownloadPdf = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginX = 48;
    const marginY = 52;
    const maxTextWidth = pageWidth - marginX * 2;
    let y = marginY;

    const ensureSpace = (requiredHeight = 20) => {
      if (y + requiredHeight > pageHeight - marginY) {
        pdf.addPage();
        y = marginY;
      }
    };

    const writeWrappedText = (text, fontSize = 12, lineHeight = 18) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxTextWidth);
      ensureSpace(lines.length * lineHeight + 6);
      pdf.text(lines, marginX, y);
      y += lines.length * lineHeight + 6;
    };

    pdf.setFont("helvetica", "bold");
    writeWrappedText(`${FILE_NAME} - Translated Output`, 16, 24);
    pdf.setFont("helvetica", "normal");
    writeWrappedText(
      `Source: ${SOURCE_LANGUAGE}   Target: ${TARGET_LANGUAGE}`,
      11,
      16,
    );
    y += 8;

    chunks.forEach((chunk) => {
      (chunk.translated_chunk || []).forEach((block) => {
        if (block.type === "Heading") {
          pdf.setFont("helvetica", "bold");
          writeWrappedText(block.text || "", 14, 22);
          pdf.setFont("helvetica", "normal");
          return;
        }

        if (block.type === "ListBlock") {
          const listItems = normalizeListItems(block.text || "");
          listItems.forEach((item, index) => {
            writeWrappedText(`${index + 1}. ${item}`, 12, 18);
          });
          y += 2;
          return;
        }

        writeWrappedText(block.text || "", 12, 18);
      });

      y += 6;
    });

    const outputName = `${normalizeFileName(FILE_NAME)}_translated.pdf`;
    pdf.save(outputName);
  };

  const handleHighlightClick = (errorId) => {
    setActiveErrorId(errorId);
    requestAnimationFrame(() => {
      const target = errorCardRefs.current[errorId];
      target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const registerHighlightRef = (errorId, element) => {
    if (!errorId || !element) return;
    highlightRefs.current[errorId] = element;
  };

  const handleIssueCardClick = (errorId) => {
    setActiveErrorId(errorId);
    requestAnimationFrame(() => {
      const target = highlightRefs.current[errorId];
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const sourceBlocks = currentChunk?.payload?.text_to_translate || [];
  const translationBlocks = currentChunk?.translated_chunk || [];
  const visibleErrors = filteredErrors;

  if (!currentChunk) {
    return null;
  }

  const mandatoryVisibleCount = visibleErrors.filter(
    (error) => error.severity === "Critical",
  ).length;
  const optionalVisibleCount = visibleErrors.filter(
    (error) => error.severity !== "Critical",
  ).length;

  const estimatedPages = Math.max(1, Math.round(totalWords / 300));
  const tokensUsedApprox = Math.round(totalWords * 1.94);

  const renderSourceBlock = (block, index) => {
    if (block.type === "Heading") {
      return (
        <h3
          key={`source-${index}`}
          className="text-[28px] font-semibold text-slate-800"
        >
          {block.text}
        </h3>
      );
    }

    if (block.type === "ListBlock") {
      const items = normalizeListItems(block.text);
      return (
        <ol
          key={`source-${index}`}
          className="list-decimal space-y-2 pl-6 text-[18px] leading-8 text-slate-700"
        >
          {items.map((item, itemIndex) => (
            <li key={`source-${index}-${itemIndex}`}>{item}</li>
          ))}
        </ol>
      );
    }

    return (
      <p
        key={`source-${index}`}
        className="text-[18px] leading-8 text-slate-700 whitespace-pre-wrap"
      >
        {block.text}
      </p>
    );
  };

  const renderTranslationBlock = (block, index) => {
    const highlights = blockHighlights[index] || [];
    const listItems =
      block.type === "ListBlock" ? normalizeListItems(block.text) : [];
    const errorsForCurrentBlock = filteredErrors.filter(
      (error) => error.error_location_index === index && error.problematic_text,
    );

    if (manualEdit) {
      if (block.type === "Heading") {
        return (
          <input
            key={`translation-edit-${index}`}
            value={block.text}
            onChange={(event) =>
              handleTextBlockChange(index, event.target.value)
            }
            className="w-full rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-[28px] font-semibold text-slate-800 outline-none ring-0 transition focus:border-indigo-400"
          />
        );
      }

      if (block.type === "ListBlock") {
        return (
          <div key={`translation-edit-${index}`} className="space-y-3">
            {listItems.map((item, itemIndex) => (
              <div
                key={`translation-list-${index}-${itemIndex}`}
                className="flex gap-3"
              >
                <span className="pt-3 text-[18px] font-medium text-slate-500">
                  {itemIndex + 1}.
                </span>
                <textarea
                  value={item}
                  rows={2}
                  onChange={(event) =>
                    handleListItemChange(index, itemIndex, event.target.value)
                  }
                  className="w-full resize-none rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-[18px] leading-8 text-slate-700 outline-none transition focus:border-indigo-400"
                />
              </div>
            ))}
          </div>
        );
      }

      return (
        <textarea
          key={`translation-edit-${index}`}
          value={block.text}
          rows={Math.max(4, Math.ceil(block.text.length / 90))}
          onChange={(event) => handleTextBlockChange(index, event.target.value)}
          className="w-full resize-none rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-[18px] leading-8 text-slate-700 outline-none transition focus:border-indigo-400"
        />
      );
    }

    if (block.type === "Heading") {
      return (
        <h3
          key={`translation-${index}`}
          className="text-[28px] font-semibold text-slate-800"
        >
          {renderHighlightedText(
            block.text,
            highlights,
            activeError?.id,
            handleHighlightClick,
            registerHighlightRef,
          )}
        </h3>
      );
    }

    if (block.type === "ListBlock") {
      const listItemHighlights = listItems.map((item) =>
        errorsForCurrentBlock
          .filter((error) => item.includes(error.problematic_text))
          .map((error) => {
            const start = item.indexOf(error.problematic_text);
            return {
              id: error.id,
              severity: error.severity,
              start,
              end: start + error.problematic_text.length,
            };
          })
          .filter((highlight) => highlight.start >= 0),
      );

      return (
        <ol
          key={`translation-${index}`}
          className="list-decimal space-y-2 pl-6 text-[18px] leading-8 text-slate-700"
        >
          {listItems.map((item, itemIndex) => (
            <li key={`translation-${index}-${itemIndex}`}>
              {renderHighlightedText(
                item,
                listItemHighlights[itemIndex] || [],
                activeError?.id,
                handleHighlightClick,
                registerHighlightRef,
              )}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p
        key={`translation-${index}`}
        className="text-[18px] leading-8 text-slate-700 whitespace-pre-wrap"
      >
        {renderHighlightedText(
          block.text,
          highlights,
          activeError?.id,
          handleHighlightClick,
          registerHighlightRef,
        )}
      </p>
    );
  };

  const translationQualityAside = (
    <aside className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <h3 className=" h-14 text-[16px] font-bold uppercase tracking-wide text-slate-900 sm:text-[16px]  flex items-center ml-4">
        Translation Quality
      </h3>
      <div className="border-b border-gray-300"></div>

      <div className="py-2 min-h-0 flex-1 overflow-y-auto px-4">
        <div className="">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">
              TQE Score
            </span>
            <span className="text-lg font-bold text-emerald-600">{score}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-indigo-600 via-violet-500 to-emerald-500 transition-all"
              style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
            />
          </div>
        </div>

        <h4 className="pt-5 text-lg font-semibold text-slate-900 sm:text-xl">
          Current Issues
        </h4>

        <div className="mt-2 space-y-4 pr-1">
          {visibleErrors.length === 0 ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <div className="flex items-center gap-2 font-semibold">
                <Check size={16} />
                No visible issues for this section.
              </div>
              <p className="mt-2">
                {showOnlyMandatory
                  ? "All mandatory fixes are resolved."
                  : "All suggestions for this section are resolved."}
              </p>
            </div>
          ) : (
            visibleErrors.map((error, index) => {
              const theme =
                severityTheme[error.severity] || severityTheme.Minor;
              const isActive = activeError?.id === error.id;

              return (
                <div
                  key={error.id}
                  ref={(element) => {
                    if (element) {
                      errorCardRefs.current[error.id] = element;
                    }
                  }}
                  className={`rounded-2xl border p-4 transition ${
                    isActive
                      ? `${theme.card} shadow-sm`
                      : "border-slate-200 bg-slate-50/70 hover:bg-slate-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleIssueCardClick(error.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Issue {index + 1}: {error.category}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {error.description}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}
                      >
                        {error.severity}
                      </span>
                    </div>

                    {error.problematic_text && (
                      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                        <span className="font-semibold text-slate-900">
                          Problematic text:
                        </span>{" "}
                        {error.problematic_text}
                      </div>
                    )}
                  </button>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-orange-600">
                      Suggestions:
                    </p>

                    <div className="mt-3 space-y-2">
                      {[
                        ...(error.original_text
                          ? [
                              {
                                value: error.original_text,
                                label: `* Original: ${error.original_text}`,
                              },
                            ]
                          : []),
                        ...((error.suggestions || []).map((suggestion) => ({
                          value: suggestion,
                          label: suggestion,
                        })) || []),
                      ]
                        .filter(
                          (item, index, items) =>
                            items.findIndex(
                              (candidate) => candidate.value === item.value,
                            ) === index,
                        )
                        .map((suggestionItem) => (
                          <button
                            key={`${error.id}-${suggestionItem.value}`}
                            type="button"
                            onClick={() =>
                              handleApplySuggestion(error, suggestionItem.value)
                            }
                            className="w-full rounded-2xl border border-orange-200 bg-white p-3 text-left text-sm text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                          >
                            {suggestionItem.label}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <MainNavbar />

      <header className="w-full bg-white border-b border-gray-200">
        <div className="mx-auto w-full flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8 border-b border-slate-300/50">
          <div className=" w-full flex flex-wrap justify-between items-center">
            <div className="flex flex-col min-w-0 gap-3">
              <div className="flex gap-2 items-center">
                <FileText
                  className=" text-slate-600"
                  size={25}
                  strokeWidth={1.75}
                />
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  {FILE_NAME}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Pill className="bg-slate-100 text-slate-700 border-gray-300 text-sm">
                  {SOURCE_LANGUAGE} <span className="text-slate-400">→</span>{" "}
                  {TARGET_LANGUAGE}
                </Pill>
                <Pill className="bg-sky-50 text-sm text-sky-800 border-sky-200">
                  {INDUSTRY}
                </Pill>
                <Pill className="bg-emerald-50 text-sm text-emerald-800 border-emerald-200">
                  ✓ Completed
                </Pill>
                <Pill className="items-center gap-1 rounded-full border-violet-200 bg-violet-50 text-sm text-violet-800">
                  <Sparkles size={14} className="text-violet-600" />
                  AI-Assisted Editing - Suggest Mode
                </Pill>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 sm:gap-3 lg:justify-end">
              <Button className="shadow-sm" leftIcon={<Save size={18} />}>
                <span className="ml-2">Save Changes</span>
              </Button>
              <Button
                variant="outline"
                leftIcon={<Download size={18} />}
                className="border-slate-300 bg-white text-slate-700 shadow-sm"
                onClick={handleDownloadPdf}
              >
                <span className="ml-2">Download</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full border-b border-slate-300/50 bg-white">
          <div className="mx-auto flex w-full flex-col flex-wrap gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            {/* Left Navs */}
            <div className="flex flex-wrap gap-5 items-center">
              {/* First Navigation */}
              <div className="flex items-center gap-1 rounded-lg border border-slate-300/80 bg-white/90 p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentChunkIndex((value) => Math.max(0, value - 1));
                    setActiveErrorId(null);
                  }}
                  disabled={currentChunkIndex === 0}
                  className="rounded-md border border-transparent p-2 text-slate-600 transition hover:bg-white  hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous section"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="px-2 text-sm text-slate-700 sm:px-3">
                  <span className="font-bold text-slate-900">
                    Section {currentChunkIndex + 1}
                  </span>{" "}
                  of {totalIssues}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentChunkIndex((value) =>
                      Math.min(chunks.length - 1, value + 1),
                    );
                    setActiveErrorId(null);
                  }}
                  disabled={currentChunkIndex === chunks.length - 1}
                  className="rounded-md border border-transparent p-2 text-slate-600 transition hover:bg-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next section"
                >
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Divider */}
              <div className="hidden h-7 w-px shrink-0 bg-gray-300/80 sm:block" />

              {/* Second Navigation */}
              <div className="flex items-center gap-5">
                <div className="relative min-w-44 flex-1 sm:max-w-xs">
                  <select
                    value={currentChunkIndex}
                    onChange={handleJumpToChunk}
                    className="h-9 w-full appearance-none rounded-md border border-gray-300/80 bg-white pl-3 pr-9 text-sm font-medium text-gray-700 shadow-2xs outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  >
                    {chunks.map((chunk, index) => (
                      <option key={chunk.chunk_id} value={index}>
                        {index === currentChunkIndex
                          ? `Section ${index + 1}`
                          : `Jump to section ${index + 1}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>

                <div className="hidden h-7 w-px shrink-0 bg-gray-300/80 sm:block" />

                <div className="flex items-center gap-2 text-gray-500">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentChunkIndex((value) => Math.max(0, value - 1));
                      setActiveErrorId(null);
                    }}
                    disabled={currentChunkIndex === 0}
                    className="rounded-md border border-gray-300/80 bg-white/90 p-1.5 shadow-sm transition hover:bg-white hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous section"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentChunkIndex((value) =>
                        Math.min(chunks.length - 1, value + 1),
                      );
                      setActiveErrorId(null);
                    }}
                    disabled={currentChunkIndex === chunks.length - 1}
                    className="rounded-md border border-gray-300/80 bg-white/90 p-1.5 shadow-sm transition hover:bg-white hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next section"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Navigation - Checkbox */}
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={showOnlyMandatory}
                onChange={(event) => {
                  setShowOnlyMandatory(event.target.checked);
                  ensureActiveError(
                    (currentChunk?.mqm_result?.errors || []).filter((error) =>
                      event.target.checked
                        ? error.severity === "Critical"
                        : true,
                    ),
                  );
                }}
                className="h-4 w-4 shrink-0 rounded border-gray-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-200"
              />
              Show only mandatory fixes
            </label>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col pb-2">
        <div className="mx-auto w-full flex-1 px-4 sm:px-6 lg:px-8">
          {/* Main content grid */}
          <div className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,4.2fr)_minmax(0,5.8fr)_minmax(350px,400px)] lg:items-stretch lg:gap-5">
            {/* ORIGINAL TEXT BLOCK */}
            <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-gray-300 bg-gray-50 lg:h-[calc(100dvh-19rem)] lg:min-h-80">
              <div className=" h-14 flex shrink-0 items-center justify-between gap-2 border-b border-gray-300 px-4 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <h3 className="text-sm font-bold tracking-wide text-indigo-950">
                    ORIGINAL TEXT
                  </h3>
                  <span className="rounded border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                    EN
                  </span>
                </div>
              </div>
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
                {sourceBlocks.map((block, index) =>
                  renderSourceBlock(block, index),
                )}
              </div>
            </section>

            <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md lg:h-[calc(100dvh-19rem)] lg:min-h-80">
              <div className="h-14 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-300 px-4 ">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <h3 className="text-sm font-bold tracking-wide text-indigo-950">
                    TRANSLATION
                  </h3>
                  <span className="rounded border border-gray-300 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-800">
                    {TARGET_LANGUAGE}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-800">
                    <AlertTriangle size={14} className="text-red-600" />
                    {criticalCount} Mandatory
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-900">
                    <AlertTriangle size={14} className="text-amber-600" />
                    {minorCount} Optional
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setManualEdit((value) => !value)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold cursor-pointer transition ${
                    manualEdit
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-indigo-300 bg-sky-50 text-indigo-700 hover:bg-sky-100"
                  }`}
                >
                  <PencilLine size={16} />
                  {manualEdit ? "Stop Editing" : "Edit Manually"}
                </button>
              </div>
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
                {translationBlocks.map((block, index) =>
                  renderTranslationBlock(block, index),
                )}
              </div>
            </section>

            <div className="flex min-h-0 flex-col lg:h-[calc(100dvh-19rem)] lg:min-h-80">
              {translationQualityAside}
            </div>
          </div>
        </div>
      </div>

      <footer className="bottom-0 border-t border-slate-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="mx-auto flex max-w-450 flex-col gap-3 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <span>
              Pages <strong className="text-slate-900">{estimatedPages}</strong>
            </span>
            <span>
              Words{" "}
              <strong className="text-slate-900">
                {totalWords.toLocaleString()}
              </strong>
            </span>
            <span>
              Tokens Used{" "}
              <strong className="text-slate-900">
                {tokensUsedApprox.toLocaleString()}
              </strong>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="inline-flex items-center gap-2">
              Completions <strong className="text-emerald-600">98%</strong>
              <span className="inline-flex h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                <span className="h-full w-[98%] rounded-full bg-emerald-500" />
              </span>
            </span>
            <span className="text-slate-500">Last saved 2 mins ago</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReviewTranslation;
