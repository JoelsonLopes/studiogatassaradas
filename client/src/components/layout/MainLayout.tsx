import Sidebar from "./sidebar";
import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-neutral-lightest">
        {children}
      </main>
    </div>
  );
} 