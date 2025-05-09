import Sidebar from "./sidebar";
import React from "react";
import MobileNavigation from "./mobile-navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <main className="flex-1 w-full bg-neutral-lightest pb-24 md:pb-0">
        {children}
      </main>
      <MobileNavigation />
    </div>
  );
} 