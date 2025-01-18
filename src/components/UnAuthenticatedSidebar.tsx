import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const UnAuthenticatedSidebar = () => {
  return (
    <div className={"sticky top-20"}>
      <Card>
        <CardHeader className={"space-y-6"}>
          <CardTitle className={"text-center text-xl font-semibold"}>
            Welcome Back!
          </CardTitle>
          <CardDescription className={"text-center text-muted-foreground"}>
            Login to access your profile and connect with others.
          </CardDescription>
        </CardHeader>
        <CardContent className={"space-y-2"}>
          <SignInButton mode={"modal"}>
            <Button className={"w-full"} variant={"outline"}>
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode={"modal"}>
            <Button className={"w-full"}>SignUp</Button>
          </SignUpButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnAuthenticatedSidebar;
