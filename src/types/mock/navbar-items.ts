import {
  House,
  Library,
  MessagesSquare,
  Settings2,
} from "lucide-react";

export const navBarItems = ["Home", "About", "Services", "Contact"];

export const data = {
  user: {
    name: "vietravel",
    email: "info@vietravel.com",
    avatar: "/icon.svg",
  },
  navMain: [
    {
      title: "Khác",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Danh mục",
          url: "/category",
        },
        {
          title: "Nguồn kiến thức",
          url: "/resource",
        }
      ],
    },
  ],
  projects: [
    {
      name: "Trang chủ",
      url: "/home",
      icon: House,
    },
    {
      name: "Chat với AI",
      url: "/chat",
      icon: MessagesSquare,
    },
    {
      name: "Kiến thức",
      url: "/knowledge",
      icon: Library,
    }
  ],
};
