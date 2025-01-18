import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import UnAuthenticatedSidebar from "@/components/UnAuthenticatedSidebar";
import { getUserByClerkId } from "@/actions/user.action";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";

const Sidebar = async () => {
  const authUser = await currentUser();
  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  return (
    <div className={"sticky top-20"}>
      <Card>
        <CardContent className={"p-6"}>
          <div className={"flex flex-col items-center justify-center"}>
            <Link
              href={`/profile/${user.username}`}
              className={"flex flex-col items-center justify-center"}
            >
              <Avatar className={"h-20 w-20 border-2"}>
                <AvatarImage src={user.image || "/avatar.png"} />
              </Avatar>

              <div className={"mt-4 space-y-2 text-center"}>
                <h3 className={"text-xl font-semibold"}>{user.name}</h3>
                <p className={"text-sm text-muted-foreground"}>
                  @{user.username}
                </p>
              </div>
            </Link>

            {user.bio && (
              <p className={"mt-3 text-sm text-muted-foreground"}>{user.bio}</p>
            )}

            <Separator className={"my-4"} />

            <div className={"w-full"}>
              <div className={"flex items-center justify-between"}>
                <div
                  className={"flex flex-col items-center justify-center gap-3"}
                >
                  <p className={"font-medium"}>{user._count.following}</p>
                  <p className={"text-xs text-muted-foreground"}>Following</p>
                </div>

                <Separator orientation="vertical" />

                <div
                  className={"flex flex-col items-center justify-center gap-3"}
                >
                  <p className={"font-medium"}>{user._count.followers}</p>
                  <p className={"text-xs text-muted-foreground"}>Followers</p>
                </div>
              </div>
            </div>

            <Separator className={"my-4"} />

            <div className={"flex w-full flex-col items-start justify-center"}>
              <div className={"flex items-center text-muted-foreground"}>
                <MapPinIcon className={"mr-2 h-4 w-4"} />
                {user.location || "No location"}
              </div>
              <div className={"flex items-center text-muted-foreground"}>
                <LinkIcon className={"mr-2 h-4 w-4"} />
                {user.website ? (
                  <a
                    href={`${user.website}`}
                    className={"trucnateed hover:underline"}
                    target={"_blank"}
                  >
                    {user.website}
                  </a>
                ) : (
                  "No website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
