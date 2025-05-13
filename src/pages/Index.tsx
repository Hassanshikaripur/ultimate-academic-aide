
import { DocumentGrid } from "@/components/dashboard/DocumentGrid";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
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
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">My Documents</h1>
      <DocumentGrid isAuthenticated={isAuthenticated} isLoading={isLoading} />
    </DashboardLayout>
  );
};

export default Index;
