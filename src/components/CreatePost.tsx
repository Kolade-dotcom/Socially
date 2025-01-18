"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { createPost } from "@/actions/post.action";
import { useToast } from "@/hooks/use-toast";

const CreatePost = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (!result) throw new Error("Failed to create post");

      if (result.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
      }

      toast({
        title: "Success.",
        description: "Post was created successfully.",
      });
    } catch (e) {
      console.error("Failed to create Post:", e);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed to create Post.",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className={""}>
      <CardContent className={"px-6 py-8"}>
        <div className={"space-y-4"}>
          <div className={"flex space-x-4"}>
            <Avatar className={"h-10 w-10"}>
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>

            <Textarea
              placeholder={"What's on your mind?"}
              className={
                "min-h-[100px] resize-none border-none bg-none p-0 text-base focus-visible:ring-0"
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {(showImageUpload || imageUrl) && (
            <div className={"rounded-lg border p-4"}>
              <ImageUpload
                endpoint={"postImage"}
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )}

          <div className={"flex items-center justify-between border-t pt-4"}>
            <Button
              className={"text-muted-foreground hover:text-primary"}
              variant={"ghost"}
              onClick={() => setShowImageUpload(!showImageUpload)}
              disabled={isPosting}
            >
              <ImageIcon className={"size-4"} />
              Photo
            </Button>

            {user ? (
              <Button
                className={"flex items-center"}
                onClick={handleSubmit}
                disabled={(!content.trim() && !imageUrl) || isPosting}
              >
                {isPosting ? (
                  <>
                    <Loader2Icon className={"size-4 animate-spin"} />
                    Posting...
                  </>
                ) : (
                  <>
                    <SendIcon className={"size-4"} />
                    Post
                  </>
                )}
              </Button>
            ) : (
              <SignInButton mode={"modal"}>
                <Button
                  className={"flex items-center"}
                  onClick={handleSubmit}
                  disabled={(!content.trim() && !imageUrl) || isPosting}
                >
                  <SendIcon className={"size-4"} />
                  Post
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
