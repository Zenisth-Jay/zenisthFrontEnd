const ERROR_CODE_MESSAGES = {
  DOCUMENT_NOT_READABLE:
    "Text is not clear enough to extract data. Please try uploading a clearer file.",
  INVALID_TAG:
    "The selected tag is not valid for this document. Please choose a different tag or review your document.",
  JOB_FAILED:
    "The operation failed due to an internal error. Please visit the Document History page, select the correct tag for your documents, and start the batch again.",

  FILE_PROCESS_FAILURE:
    "We couldn’t open this file. It may be corrupted or protected. Please upload a different file.",

  AWS_TRANSLATE_ERROR:
    "We couldn’t translate this file. It may not contain readable text or is not supported.",

  POST_PROCESSING_ERROR:
    "Your file was translated, but we couldn’t prepare the final output. Please try again.",
};

export const getErrorMessageFromCode = (code) => {
  if (!code) return null;
  return (
    ERROR_CODE_MESSAGES[code] ||
    "The operation failed due to an internal error. Please visit the Document History page, select the correct tag for your documents, and start the batch again."
  );
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
