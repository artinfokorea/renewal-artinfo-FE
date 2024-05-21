"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

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

  // console.log("user", data);

  const handleSign = () => {
    if (data?.user) {
      signOut({ callbackUrl: "/auth/sign-in" });
    } else {
      router.push("/auth/sign-in");
    }
  };

  return (
    <header className="sticky top-0 left-0 z-50 border-b-2 border py-2 px-4">
      <div className="max-w-screen-lg flex justify-between items-center mx-auto ">
        <div className="flex">
          <Link href="/">
            <h1 className="font-bold text-2xl text-main">ARTINFO</h1>
          </Link>
          <NavigationMenu className="ml-16 hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                {NavItems.map(({ href, label }) => {
                  const isActive = pathname.includes(href);
                  return (
                    <NavigationMenuLink
                      href={href}
                      key={href}
                      className={`mx-4 font-semibold ${
                        isActive && "text-main"
                      }`}
                    >
                      {label}
                    </NavigationMenuLink>
                  );
                })}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {data?.user ? (
          <Button
            className="bg-white text-main border-main border text-sm h-8 hover:bg-white"
            onClick={handleSign}
          >
            로그인
          </Button>
        ) : (
          <Button className="bg-white text-main" onClick={handleSign}>
            로그아웃
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
