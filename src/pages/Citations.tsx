
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { CitationManager } from "@/components/citations/CitationManager";

const Citations = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <CitationManager />
        </main>
      </div>
    </div>
  );
};

export default Citations;
