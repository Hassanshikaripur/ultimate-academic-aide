
import { DocumentGrid } from "@/components/dashboard/DocumentGrid";
import AppSidebar from "@/components/layout/AppSidebar";
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import { useSidebar } from "@/components/ui/sidebar";

const Index = () => {
  const { state } = useSidebar();
  
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className={`flex-1 transition-all duration-300 ${state === "expanded" ? "ml-0 md:ml-64" : "ml-0"}`}>
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <DocumentGrid />
        </main>
      </div>
    </div>
  );
};

export default Index;
