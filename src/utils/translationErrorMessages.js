const ERROR_CODE_MESSAGES = {
  DOCUMENT_NOT_READABLE:
    "Text is not clear enough to extract data. Please try uploading a clearer file.",
  INVALID_TAG:
    "The selected tag is not valid for this document. Please choose a different tag or review your document.",
  JOB_FAILED:
    "The operation failed due to an internal error. Please try again later.",
  INTERNAL_SERVER_ERROR: "Something went wrong. Please try again.",
};

export const getErrorMessageFromCode = (code) => {
  if (!code) return null;
  return ERROR_CODE_MESSAGES[code] || "Something went wrong. Please try again.";
};

export const extractErrorCode = (rawErrorMessage) => {
  if (!rawErrorMessage) return null;

  try {
    if (typeof rawErrorMessage === "string") {
      const parsed = JSON.parse(rawErrorMessage);
      return parsed?.code || null;
    }

    if (typeof rawErrorMessage === "object") {
      return rawErrorMessage?.code || null;
    }
  } catch (error) {
    return null;
  }

  return null;
};
