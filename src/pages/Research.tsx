import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { KnowledgeGraph } from "@/components/research/KnowledgeGraph";
import { PaperAnalysis } from "@/components/research/PaperAnalysis";
import { ResearchConnections } from "@/components/research/ResearchConnections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Save, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReactFlowProvider } from "@xyflow/react";
import { useSidebar } from "@/components/ui/sidebar";

const Research = () => {
  const [activeTab, setActiveTab] = useState("knowledge-graph");
  const [researchName, setResearchName] = useState("My Research Project");
  const [researchDescription, setResearchDescription] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { state } = useSidebar();
  
  // Check if database tables exist
  useEffect(() => {
    async function checkDatabaseTables() {
      try {
        // Check if the papers table exists
        const { error: papersError } = await supabase
          .from('papers')
          .select('count(*)')
          .limit(1);
          
        // Check if the researchers table exists
        const { error: researchersError } = await supabase
          .from('researchers')
          .select('count(*)')
          .limit(1);
          
        // If we get errors, that might indicate missing tables
        if ((papersError && papersError.code === '42P01') || 
            (researchersError && researchersError.code === '42P01')) {
          console.error("Some tables don't exist yet:", { papersError, researchersError });
          toast({
            title: "Database setup incomplete",
            description: "Some database tables are not set up. Some features may use sample data instead.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking database:", error);
      }
    }
    
    checkDatabaseTables();
  }, [toast]);
  
  // Handle sharing research
  const handleShareResearch = () => {
    // Generate a "shareable" link (in a real app, this would create a proper sharing mechanism)
    const shareableLink = `${window.location.origin}/share?id=${Date.now()}`;
    
    // Copy link to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast({
          description: "Share link copied to clipboard!",
        });
        setShowShareDialog(false);
      })
      .catch(err => {
        console.error("Could not copy link: ", err);
        toast({
          title: "Error copying link",
          description: "Please try again or copy manually.",
          variant: "destructive"
        });
      });
  };

  // Handle saving research progress
  const handleSaveProgress = async () => {
    try {
      setIsSaving(true);
      
      // For demonstration purposes, we'll just simulate a save operation
      // In a real app, this would save the current state of the research to the database
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        description: "Research progress saved successfully!",
      });
    } catch (error) {
      console.error("Error saving research:", error);
      toast({
        title: "Error",
        description: "Could not save research progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle downloading research data
  const handleDownloadData = () => {
    // In a real app, this would gather all research data and format it
    // For now, we'll create a simple JSON object with metadata
    const researchData = {
      name: researchName,
      description: researchDescription,
      date: new Date().toISOString(),
      activeTab: activeTab,
    };
    
    // Create and download file
    const dataStr = JSON.stringify(researchData, null, 2);
    const dataUri = `data:application/${exportFormat === 'json' ? 'json' : 'text/csv'};charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUri;
    downloadLink.download = `${researchName.replace(/\s+/g, '-').toLowerCase()}.${exportFormat}`;
    downloadLink.click();
    
    toast({
      description: `Research data downloaded as ${exportFormat.toUpperCase()}!`,
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 transition-all duration-300 w-full">
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="knowledge-graph">Knowledge Graph</TabsTrigger>
                <TabsTrigger value="paper-analysis">Paper Analysis</TabsTrigger>
                <TabsTrigger value="connections">Research Connections</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveProgress}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <><span className="animate-spin mr-2">◌</span> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> Save</>
                  )}
                </Button>
                
                <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share Research</DialogTitle>
                      <DialogDescription>
                        Create a shareable link to your research project.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div>
                        <label className="text-sm font-medium">Project Name</label>
                        <Input
                          value={researchName}
                          onChange={(e) => setResearchName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Textarea
                          value={researchDescription}
                          onChange={(e) => setResearchDescription(e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Sharing Options</label>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2">
                            <input type="radio" id="view" name="permission" defaultChecked />
                            <label htmlFor="view" className="text-sm">View only</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input type="radio" id="comment" name="permission" className="ml-1" />
                            <label htmlFor="comment" className="text-sm">Can comment</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input type="radio" id="edit" name="permission" className="ml-1" />
                            <label htmlFor="edit" className="text-sm">Can edit</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={handleShareResearch}>
                        Create Share Link
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Export Research Data</DialogTitle>
                      <DialogDescription>
                        Download your research data in different formats.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div>
                        <label className="text-sm font-medium">Export Format</label>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              id="json" 
                              name="format" 
                              value="json"
                              checked={exportFormat === "json"}
                              onChange={() => setExportFormat("json")}
                            />
                            <label htmlFor="json" className="text-sm">JSON</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              id="csv" 
                              name="format" 
                              value="csv" 
                              className="ml-1"
                              checked={exportFormat === "csv"}
                              onChange={() => setExportFormat("csv")}
                            />
                            <label htmlFor="csv" className="text-sm">CSV</label>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input 
                              type="radio" 
                              id="pdf" 
                              name="format" 
                              value="pdf" 
                              className="ml-1"
                              checked={exportFormat === "pdf"}
                              onChange={() => setExportFormat("pdf")}
                              disabled
                            />
                            <label htmlFor="pdf" className="text-sm text-muted-foreground">PDF (Coming soon)</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Include</label>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="graphs" defaultChecked />
                            <label htmlFor="graphs" className="text-sm ml-2">Knowledge Graphs</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input type="checkbox" id="papers" defaultChecked />
                            <label htmlFor="papers" className="text-sm ml-2">Papers & Notes</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input type="checkbox" id="connections" defaultChecked />
                            <label htmlFor="connections" className="text-sm ml-2">Connections</label>
                          </div>
                          
                          <div className="flex items-center">
                            <input type="checkbox" id="metadata" defaultChecked />
                            <label htmlFor="metadata" className="text-sm ml-2">Metadata</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button onClick={handleDownloadData}>
                        Download
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <ReactFlowProvider>
              <TabsContent value="knowledge-graph">
                <KnowledgeGraph />
              </TabsContent>
              
              <TabsContent value="paper-analysis">
                <PaperAnalysis />
              </TabsContent>
              
              <TabsContent value="connections">
                <ResearchConnections />
              </TabsContent>
            </ReactFlowProvider>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Research;
