import { SignedIn, SignedOut } from "@/components/general/AuthComponents";
import Logo from "@/components/general/Logo";
import SignoutButton from "@/components/general/SIgnoutButton";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import React from "react";

export default function MainHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 w-full border-b px-4 backdrop-blur lg:px-0">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex"></nav>
        <div className="flex items-center gap-4">
          <SignedIn>
            <SignoutButton />
            <Link href={"/dashboard/home"}>
              <Button size="sm">Dashboard</Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href={"/login"}>
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href={"/signup"}>
              <Button size="sm">Create Account</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
