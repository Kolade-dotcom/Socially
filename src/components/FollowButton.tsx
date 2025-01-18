"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toggleFollow } from "@/actions/user.action";

const FollowButton = ({ userId }: { userId?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFollow = async () => {
    setIsLoading(true);

    try {
      const result = await toggleFollow(userId);

      if (!result?.success) throw new Error("Follow failed");

      toast({
        title: "Success",
        description: "Follow was successfully!",
      });
    } catch (e) {
      console.error("Error following user:", e);
      toast({
        title: "Error following user",
        description: (e as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      className={"w-20"}
    >
      {isLoading ? <Loader2Icon className={"size-4 animate-spin"} /> : "Follow"}
    </Button>
  );
};

export default FollowButton;
