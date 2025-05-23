
import { DocumentGrid } from "@/components/dashboard/DocumentGrid";
import AppSidebar from "@/components/layout/AppSidebar";
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <div className="ml-0">
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <DocumentGrid />
        </main>
      </div>
    </div>
  );
};

export default Index;
