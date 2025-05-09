
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { KnowledgeGraph } from "@/components/research/KnowledgeGraph";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Research = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <AppHeader />
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
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-serif">Paper Analysis</h2>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[30rem]">
                  <p className="text-muted-foreground">Select papers to analyze with AI</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-serif">Research Connections</h2>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[30rem]">
                  <p className="text-muted-foreground">AI will help you discover connections between your research documents</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Research;
