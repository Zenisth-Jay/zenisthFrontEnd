import { Shield, UserCog } from "lucide-react";

export const adminMenu = {
  title: "Access Management",

  items: [
    {
      label: "Security Center",
      description: "Data Retention",
      icon: Shield,
      path: "/admin/security-center",
    },
    {
      label: "Access Control",
      description: "Manage roles",
      icon: UserCog,
      path: "/admin/access-control",
    },
  ],
};
