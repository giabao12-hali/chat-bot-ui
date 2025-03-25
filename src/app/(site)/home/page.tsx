'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { data } from "@/types/mock/navbar-items";
import Link from "next/link";


export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedData = Cookies.get("rememberMe");
    if (storedData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(storedData));
        setUsername(parsedData.username);
      } catch (error) {
        console.error("Lỗi khi giải mã cookie:", error);
      }
    }
  }, []);
  return (
    <div className='container mx-auto p-4 flex justify-center items-center flex-col'>
      <h1 className='text-2xl font-semibold'>
        {username ? `Xin chào, ${username}!` : "Xin chào!"}
      </h1>

      <div className="md:mt-20 mt-10 w-full">
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} className="md:w-1/4 sm:w-full flex justify-between items-center text-muted-foreground">
                Tìm kiếm
                <Search />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none bg-transparent shadow-none">
              <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                <CommandInput placeholder="Tìm kiếm..." />
                <CommandEmpty>Hiện tại không khả dụng</CommandEmpty>
                <CommandList>
                  <CommandGroup heading="Tính năng">
                    {data.projects.map((item, index) => (
                      <Link href={item.url} key={index}>
                        <CommandItem>
                          <item.icon />
                          <span>{item.name}</span>
                        </CommandItem>
                      </Link>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
                {data.navMain.map((item, index) => (
                  <CommandList key={index}>
                    <CommandGroup heading={item.title}>
                      {item.items.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.url}>
                          <CommandItem>
                            <item.icon />
                            <span>{subItem.title}</span>
                          </CommandItem>
                        </Link>
                      ))}
                    </CommandGroup>
                  </CommandList>
                ))}
              </Command>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}