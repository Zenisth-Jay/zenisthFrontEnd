import { FileText, Clock, Tag, Files } from "lucide-react";

export const operationsMenu = {
  title: "Translation Action",
  items: [
    {
      label: "Upload Document",
      description: "Start a new translation job",
      icon: FileText,
      path: "/operations/translate",
    },
    {
      label: "Translate History",
      description: "View past translation",
      icon: Clock,
      path: "/operations/translate/history",
    },
    {
      label: "Tag Library",
      description: "Manage translation tags",
      icon: Tag,
      path: "/operations/translate/tags-library",
    },
    {
      label: "Document History",
      description: "Manage Your Documents",
      icon: Files,
      path: "/operations/document-history",
    },
  ],
};

export const operationsMenuIDP = {
  title: "IDP Action",
  items: [
    {
      label: "Upload Document",
      description: "Start a new extraction job",
      icon: FileText,
      path: "/operations/idp",
    },
    {
      label: "Extraction History",
      description: "Track results and monitor processed documents",
      icon: Clock,
      path: "/operations/idp/history",
    },
    {
      label: "Tag Library",
      description: "Manage translation tags",
      icon: Tag,
      path: "/operations/idp/tags-library",
    },
    {
      label: "Document History",
      description: "Manage Your Documents",
      icon: Files,
      path: "/operations/document-history",
    },
  ],
};
