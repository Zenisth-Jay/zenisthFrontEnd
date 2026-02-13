import { FileText, Clock, Tag } from "lucide-react";

export const operationsMenu = {
  title: "Translation Action",
  items: [
    {
      label: "Translate Document",
      description: "Start a new translation job",
      icon: FileText,
      path: "/operations/translate",
    },
    {
      label: "Translate History",
      description: "View past translation",
      icon: Clock,
      path: "/operations/translate/translate-history",
    },
    {
      label: "Tag Library",
      description: "Manage translation tags",
      icon: Tag,
      path: "/operations/tags-library",
    },
  ],
};
