
import { ReactNode } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <AppSidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <CustomAppHeader />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="container mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
