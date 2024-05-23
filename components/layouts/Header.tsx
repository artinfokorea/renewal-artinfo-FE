"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavItems = [
  {
    href: "/recruits",
    label: "채용",
  },
  {
    href: "/lessons",
    label: "레슨",
  },
  {
    href: "/inquiry",
    label: "문의",
  },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();

  const handleSign = () => {
    if (data?.user) {
      signOut({ callbackUrl: "/auth/sign-in" });
    } else {
      router.push("/auth/sign-in");
    }
  };

  return (
    <header className="sticky top-0 left-0 z-50 py-2 px-4 bg-white shadow-md">
      <div className="max-w-screen-lg flex justify-between items-center mx-auto ">
        <div className="flex">
          <Link href="/">
            <h1 className="font-bold text-2xl text-main">ARTINFO</h1>
          </Link>
          <NavigationMenu className="ml-20 hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                {NavItems.map(({ href, label }) => {
                  const isActive = pathname.includes(href);
                  return (
                    <Link
                      href={href}
                      key={href}
                      prefetch={false}
                      className={`mx-4 font-semibold ${
                        isActive && "text-main"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {data?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
              <Avatar>
                <AvatarImage src="/img/placeholder-user.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="mx-2 hidden md:block">{data?.user.name}님</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Link href="/my-profile" prefetch={false}>
                <DropdownMenuItem>내 프로필</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleSign}>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            className="bg-white text-main border-main border text-sm h-10 hover:bg-white"
            onClick={handleSign}
          >
            로그인
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
