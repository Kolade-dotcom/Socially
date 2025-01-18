import React from "react";
import ModeToggle from "@/components/ModeToggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { currentUser, User } from "@clerk/nextjs/server";
import Link from "next/link";
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";

const DesktopNavbar = async () => {
  const user: User | null = await currentUser();
  return (
    <div className={"hidden lg:inline"}>
      <div className={"flex items-center space-x-4"}>
        <ModeToggle />

        <Button variant={"ghost"} className={"flex items-center gap-2"} asChild>
          <Link href={"/"}>
            <HomeIcon className={"h-4 w-4"} />
            <span>Home</span>
          </Link>
        </Button>

        {user ? (
          <>
            <Button
              variant={"ghost"}
              className={"flex items-center gap-2"}
              asChild
            >
              <Link href={"/notifications"}>
                <BellIcon className={"h-4 w-4"} />
                <span>Notifications</span>
              </Link>
            </Button>
            <Button
              variant={"ghost"}
              className={"flex items-center gap-2"}
              asChild
            >
              <Link
                href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split("@")[0]}`}
              >
                <UserIcon className={"h-4 w-4"} />
                <span>Profile</span>
              </Link>
            </Button>
            <UserButton />
          </>
        ) : (
          <SignInButton mode={"modal"}>
            <Button>Sign In</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default DesktopNavbar;
