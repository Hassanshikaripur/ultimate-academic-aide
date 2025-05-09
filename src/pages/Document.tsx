
import { useParams } from "react-router-dom";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { DocumentEditor } from "@/components/document/DocumentEditor";

const Document = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <AppHeader />
        <main className="w-full">
          <DocumentEditor />
        </main>
      </div>
    </div>
  );
};

export default Document;
