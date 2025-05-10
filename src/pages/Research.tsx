
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { KnowledgeGraph } from "@/components/research/KnowledgeGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaperAnalysis } from "@/components/research/PaperAnalysis";
import { ResearchConnections } from "@/components/research/ResearchConnections";

const Research = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <Tabs defaultValue="knowledge-graph">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="knowledge-graph">Knowledge Graph</TabsTrigger>
                <TabsTrigger value="paper-analysis">Paper Analysis</TabsTrigger>
                <TabsTrigger value="connections">Research Connections</TabsTrigger>
              </TabsList>
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
