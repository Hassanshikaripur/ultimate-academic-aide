
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, UploadCloud, Download, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const samplePaper = {
  title: "Large Language Models and Knowledge Graphs: A New Era for AI Research",
  authors: ["Emily Chen", "Robert Johnson", "Sarah Williams"],
  abstract: "This paper explores the intersection of large language models (LLMs) and knowledge graphs, proposing a novel framework for integrating symbolic and neural approaches to artificial intelligence. Our experiments demonstrate significant improvements in reasoning tasks and knowledge retrieval compared to traditional methods.",
  keywords: ["Large Language Models", "Knowledge Graphs", "Neural-Symbolic AI", "Knowledge Representation"],
  published: "2024",
  journal: "Journal of Artificial Intelligence Research",
  doi: "10.1234/jair.2024.1234",
  citations: 42,
  pdf: "/placeholder.svg"
};

export function PaperAnalysis() {
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-12 gap-6">
      {/* Paper details column */}
      <div className="md:col-span-7 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">{samplePaper.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {samplePaper.authors.join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                {samplePaper.journal}, {samplePaper.published} • {samplePaper.citations} citations
              </p>
              <p className="text-sm text-muted-foreground">
                DOI: {samplePaper.doi}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Abstract</h3>
              <p className="text-sm">{samplePaper.abstract}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {samplePaper.keywords.map((keyword, i) => (
                  <div key={i} className="bg-slate-100 px-2 py-1 rounded text-xs">
                    {keyword}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" className="gap-2" onClick={handleFileUpload} disabled={isUploading}>
                <UploadCloud className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload New Version"}
              </Button>
              <Button variant="secondary" className="gap-2">
                <FileText className="h-4 w-4" />
                View PDF
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Full Text Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="methods">Methods</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="references">References</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <p>This paper introduces a novel approach to combining neural language models with symbolic knowledge representations. The authors demonstrate how knowledge graphs can enhance the reasoning capabilities of large language models by providing structured factual information.</p>
                
                <p>Key contributions include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>A new framework for integrating LLMs and knowledge graphs</li>
                  <li>Empirical evidence showing improved performance on reasoning tasks</li>
                  <li>A benchmark dataset for evaluating neural-symbolic systems</li>
                  <li>An analysis of trade-offs between model size and knowledge integration</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="methods">
                <p>The methods section describes the technical approach to integrating knowledge graphs with large language models, including the architecture design, training procedure, and evaluation metrics.</p>
              </TabsContent>
              
              <TabsContent value="results">
                <p>The results section presents quantitative and qualitative findings from experiments conducted across multiple datasets, showing significant improvements over baseline models.</p>
              </TabsContent>
              
              <TabsContent value="references">
                <Accordion type="single" collapsible className="w-full">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <AccordionItem key={i} value={`ref-${i}`}>
                      <AccordionTrigger className="text-sm">
                        Reference {i}: Smith et al. (202{i})
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Smith, J., Johnson, R., & Lee, K. (202{i}). "Knowledge Representation in Neural Networks." Journal of Machine Learning, 15({i}), 234-24{i}.
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Analysis tools column */}
      <div className="md:col-span-5 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Your Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Add your notes about this paper..." 
                className="min-h-[150px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)} 
              />
            </div>
            
            <div className="flex justify-end">
              <Button>Save Notes</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">Generate Summary</Button>
            <Button variant="outline" className="w-full">Extract Key Points</Button>
            <Button variant="outline" className="w-full">Find Related Papers</Button>
            <Button variant="outline" className="w-full">Check for Gaps or Inconsistencies</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Citation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-50 rounded border text-sm">
              <p>Chen, E., Johnson, R., & Williams, S. (2024). Large Language Models and Knowledge Graphs: A New Era for AI Research. <i>Journal of Artificial Intelligence Research</i>, 42(3), 123-145. https://doi.org/10.1234/jair.2024.1234</p>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm">Copy Citation</Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                BibTeX
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
