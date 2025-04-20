import React from "react";
import { SignedIn, SignedOut } from "./AuthComponents";
import { Button } from "../ui/button";

export default async function DashboardNavbar() {
  return (
    <header className="flex w-full items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-2">
        <a
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
        >
          <span className="text-xl font-bold">AI</span>
        </a>
      </div>
      <nav className="flex items-center space-x-4">
        <SignedOut>
          <Button>Signin</Button>
        </SignedOut>
        <SignedIn>
          <Button>Signout</Button>
        </SignedIn>
      </nav>
    </header>
  );
}
