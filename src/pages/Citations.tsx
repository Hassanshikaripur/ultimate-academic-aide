
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { CitationManager } from "@/components/citations/CitationManager";
import { useSidebar } from "@/components/ui/sidebar";

const Citations = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 transition-all duration-300 w-full">
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <CitationManager />
        </main>
      </div>
    </div>
  );
};

export default Citations;
