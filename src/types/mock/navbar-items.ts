import {
  BookMarked,
  House,
  Library,
  LifeBuoy,
  MessagesSquare,
  Settings2,
  TableOfContents,
} from "lucide-react";

export const navBarItems = ["Home", "About", "Services", "Contact"];

export const itTeamMembers = [
  {
    name: "Nguyễn Minh Thư",
    role: "Đội ngũ hệ thống",
    phoneNumber: "0123456789",
  },
  {
    name: "Nguyễn Hiển Gia Bảo",
    role: "Đội ngũ giao diện",
    phoneNumber: "0123456789",
  },
]

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
          title: "Loại kiến thức",
          url: "/category",
        },
        {
          title: "Nguồn kiến thức",
          url: "/resource",
        }
      ],
    },
  ],
  navSecondary: [
    {
      title: "Hỗ trợ",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "FAQs",
      url: "/faqs",
      icon: TableOfContents,
    },
    {
      title: "Tài liệu hướng dẫn",
      url: "/tutorial",
      icon: BookMarked
    }
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
