import { Languages, FileText } from "lucide-react";

export const tools = [
  {
    id: "translation",
    title: "Translation Tool",
    description:
      "AI-powered translation with comprehensive workflow management",
    category: "translation",
    badge: "Translation",
    features: 8,
    status: "active",
    gradient:
      "linear-gradient(90deg, #2B7FFF 0%, rgba(0, 184, 219, 0.80) 100%)",
    path: "/operations/translate",
    icon: Languages,
  },

  {
    id: "idp",
    title: "IDP Tool",
    description:
      "Intelligent Document Processing with advanced extraction capabilities",
    category: "document",
    badge: "Document Processing",
    features: 9,
    status: "active",
    gradient:
      "linear-gradient(90deg, #D469D5 0%, rgba(137, 18, 102, 0.80) 100%)",
    path: "/operations/idp",
    icon: FileText,
  },
];
