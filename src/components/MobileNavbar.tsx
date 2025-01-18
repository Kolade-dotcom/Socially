"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import { SignInButton, SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import ModeToggle from "@/components/ModeToggle";
import Link from "next/link";

const MobileNavbar = () => {
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  return (
    <div className={"lg:hidden"}>
      <div className={"flex items-center gap-4"}>
        <ModeToggle />

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className={"h-5 w-5"} />
            </Button>
          </SheetTrigger>
          <SheetContent className={"w-[300px]"}>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <nav className={"mt-6 flex flex-col space-y-4"}>
              <Button
                variant={"ghost"}
                className={"flex items-center justify-start gap-2"}
                asChild
              >
                <Link href={"/"}>
                  <HomeIcon className={"h-4 w-4"} />
                  Home
                </Link>
              </Button>

              {isSignedIn ? (
                <>
                  <Button
                    variant={"ghost"}
                    className={"flex items-center justify-start gap-2"}
                    asChild
                  >
                    <Link href={"/notifications"}>
                      <BellIcon className={"h-4 w-4"} />
                      Notifications
                    </Link>
                  </Button>
                  <Button
                    variant={"ghost"}
                    className={"flex items-center justify-start gap-2"}
                    asChild
                  >
                    <Link
                      href={`/profile/${user?.username ?? user?.emailAddresses[0].emailAddress.split("@")[0]}`}
                    >
                      <UserIcon className={"h-4 w-4"} />
                      Profile
                    </Link>
                  </Button>
                  <SignOutButton>
                    <Button
                      variant={"ghost"}
                      className={"flex w-full items-center justify-start gap-2"}
                    >
                      <LogOutIcon className={"h-4 w-4"} />
                      Logout
                    </Button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode={"modal"}>
                  <Button className={"w-full"}>Sign In</Button>
                </SignInButton>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavbar;
