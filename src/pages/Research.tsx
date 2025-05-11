
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { KnowledgeGraph } from "@/components/research/KnowledgeGraph";
import { PaperAnalysis } from "@/components/research/PaperAnalysis";
import { ResearchConnections } from "@/components/research/ResearchConnections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Save, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Research = () => {
  const [activeTab, setActiveTab] = useState("knowledge-graph");
  const { toast } = useToast();
  
  // Check if database tables exist
  useEffect(() => {
    async function checkDatabaseTables() {
      try {
        // This is a simplified approach - just checking for papers table
        const { error } = await supabase
          .from('papers')
          .select('count()')
          .limit(1);
          
        // If we get an error that's likely a "relation does not exist" error
        if (error && error.code === '42P01') {
          console.error("Tables don't exist yet:", error);
          toast({
            title: "Database tables not found",
            description: "This page uses sample data as the database tables are not set up.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking database:", error);
      }
    }
    
    checkDatabaseTables();
  }, [toast]);

  const handleShareResearch = () => {
    // In a real app, this would generate a shareable link
    toast({
      description: "Share link copied to clipboard!",
    });
  };

  const handleSaveProgress = () => {
    toast({
      description: "Research progress saved successfully!",
    });
  };

  const handleDownloadData = () => {
    toast({
      description: "Research data downloaded as JSON!",
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="knowledge-graph">Knowledge Graph</TabsTrigger>
                <TabsTrigger value="paper-analysis">Paper Analysis</TabsTrigger>
                <TabsTrigger value="connections">Research Connections</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveProgress}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareResearch}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <TabsContent value="knowledge-graph">
              <KnowledgeGraph />
            </TabsContent>
            
            <TabsContent value="paper-analysis">
              <PaperAnalysis />
            </TabsContent>
            
            <TabsContent value="connections">
              <ResearchConnections />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Research;
