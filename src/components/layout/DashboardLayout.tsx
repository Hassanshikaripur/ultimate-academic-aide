
import { ReactNode } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full">
        <CustomAppHeader />
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
