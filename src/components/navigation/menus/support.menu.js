import { HelpCircle, Headphones } from "lucide-react";

export const supportMenu = {
  title: "Help & Support",
  items: [
    {
      label: "Help Center",
      description: "Browse FAQs",
      icon: HelpCircle,
      path: "/support/help",
    },
    {
      label: "Contact Support",
      description: "Get help from our team",
      icon: Headphones,
      path: "/support/contact-support",
    },
  ],
};
