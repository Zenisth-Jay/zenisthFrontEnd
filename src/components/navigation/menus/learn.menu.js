import { BookOpen, Video, FileText, Code2 } from "lucide-react";

export const learnMenu = {
  type: "mega",
  sections: [
    {
      title: "Getting Started",
      items: [
        {
          label: "Platform Overview",
          description: "Learn the basics",
          icon: BookOpen,
          path: "/learn/plateform-overview",
        },
        {
          label: "Video Tutorial",
          description: "Step-by-step guide",
          icon: Video,
          path: "/learn/video-tutorial",
        },
      ],
    },
    {
      title: "Documentation",
      items: [
        {
          label: "User Guides",
          description: "Detailed docs",
          icon: FileText,
          path: "/learn/user-guides",
        },
        {
          label: "Developer Docs",
          description: "API guides",
          icon: Code2,
          path: "/learn/developer-docs",
        },
      ],
    },
  ],
};
