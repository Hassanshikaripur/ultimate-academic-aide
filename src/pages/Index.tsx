
import { DocumentGrid } from "@/components/dashboard/DocumentGrid";
import AppSidebar from "@/components/layout/AppSidebar";
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { state } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setIsAuthenticated(!!data.user);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className={`flex-1 transition-all duration-300 ${state === "expanded" ? "ml-0 md:ml-64" : "ml-0 md:ml-16"}`}>
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <DocumentGrid isAuthenticated={isAuthenticated} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default Index;
