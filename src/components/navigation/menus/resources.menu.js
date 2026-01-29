import { KeyRound, FileText, ShieldCheck, ScrollText } from "lucide-react";

export const resourcesMenu = {
  type: "mega",

  sections: [
    {
      title: "API & Developers",
      items: [
        {
          label: "API Keys",
          description: "Authentication & Analytics",
          icon: KeyRound,
          path: "/resources/api-keys",
        },
        {
          label: "API Reference",
          description: "Developer Documentation",
          icon: FileText,
          path: "/resources/api-reference",
        },
      ],
    },

    {
      title: "Compliance",
      items: [
        {
          label: "Privacy Policy",
          description: "GDPR info",
          icon: ShieldCheck,
          path: "/resources/privacy-policy",
        },
        {
          label: "Terms of Service",
          description: "Usage of Terms",
          icon: ScrollText,
          path: "/resources/terms",
        },
      ],
    },
  ],
};
