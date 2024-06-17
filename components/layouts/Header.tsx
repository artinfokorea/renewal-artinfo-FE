"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HamburgerIcon from "../icons/HamburgerIcon";
import { USER } from "@/types/users";

const NavItems = [
  {
    href: "/jobs",
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
  const user = data?.user as USER | undefined;
  const [isTopScroll, setIsTopScroll] = useState(true);
  const [isBarOpen, setIsBarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY === 0;
      setIsTopScroll(isTop);
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsBarOpen(false);
  }, [scrollY, pathname]);

  const handleSign = () => {
    if (data?.user) {
      signOut({ callbackUrl: "/auth/sign-in" });
    } else {
      router.push("/auth/sign-in");
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 z-50 h-14 py-2 px-4 bg-white ${
        (!isTopScroll || isBarOpen) && "shadow-md"
      }
      `}
    >
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
        <div className="hidden md:flex">
          {data?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center">
                <Avatar>
                  <AvatarImage src="/img/placeholder-user.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="mx-2 hidden md:block">{user?.name}님</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/my-profile" prefetch={false}>
                  <DropdownMenuItem className="cursor-pointer">
                    내 프로필
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={handleSign}
                  className="cursor-pointer"
                >
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-white text-main border-main border text-sm h-8 hover:bg-white"
              onClick={handleSign}
            >
              로그인
            </Button>
          )}
        </div>
        <Menu>
          <MenuButton
            className="flex md:hidden"
            onClick={() => setIsBarOpen(!isBarOpen)}
          >
            <HamburgerIcon className="w-7 h-7 text-dimgray" />
          </MenuButton>
          <Transition
            show={isBarOpen}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <MenuItems
              anchor="bottom"
              className="bg-white w-screen mt-3 h-[272px] p-4 flex flex-col"
            >
              {NavItems.map(({ href, label }) => {
                const isActive = pathname.includes(href);
                return (
                  <MenuItem key={href}>
                    <Link
                      href={href}
                      className={`py-2 font-semibold w-full ${
                        isActive && "text-main"
                      }`}
                    >
                      {label}
                    </Link>
                  </MenuItem>
                );
              })}
              <div className="border-b-[1px] my-2 border-silver w-4/5 mx-auto" />
              <MenuItem>
                <Link href="/my-profile" className="my-2 font-bold w-full">
                  내정보
                </Link>
              </MenuItem>
              <MenuItem>
                {data?.user ? (
                  <span className="py-2 font-bold" onClick={handleSign}>
                    로그아웃
                  </span>
                ) : (
                  <Link href="/auth/sign-in" className="py-2 font-bold w-full">
                    로그인
                  </Link>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
