import React from "react";
import Link from "next/link";
import DesktopNavbar from "@/components/DesktopNavbar";
import MobileNavbar from "@/components/MobileNavbar";
import { syncUser } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { MessageCircle } from "lucide-react";

const Navbar = async () => {
  const user = await currentUser();
  if (user) await syncUser();

  return (
    <nav
      className={
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }
    >
      <div className={"mx-auto max-w-7xl px-4"}>
        <div className={"flex h-16 items-center justify-between"}>
          <div className={"flex items-center"}>
            <Link
              href={"/"}
              className={
                "max-sm:text-md flex items-center gap-2 font-mono text-xl font-bold tracking-wider text-primary max-sm:font-normal"
              }
            >
              <MessageCircle className={"size-8 max-sm:size-6"} />
              <span>Socially</span>
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
