import React from "react";
import MainHeader from "./_components/Header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <MainHeader />
      {children}
    </div>
  );
}
