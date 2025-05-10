
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, BookOpen, FileText, BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample paper data
const samplePapers = [
  {
    id: "1",
    title: "Deep Learning for Natural Language Processing",
    authors: "Smith J., Johnson A., Williams B.",
    abstract: "This paper explores the applications of deep learning in natural language processing, focusing on transformer architectures and their implementations.",
    year: 2023,
    journal: "Journal of Artificial Intelligence Research",
    citations: 45
  },
  {
    id: "2",
    title: "Advances in Computer Vision with Convolutional Neural Networks",
    authors: "Chen L., Garcia M., Thompson R.",
    abstract: "An overview of recent advances in computer vision using convolutional neural networks, including applications in medical imaging and autonomous driving.",
    year: 2022,
    journal: "Computer Vision and Pattern Recognition",
    citations: 78
  },
  {
    id: "3",
    title: "Reinforcement Learning: A Survey",
    authors: "Davis K., Wilson P., Brown S.",
    abstract: "A comprehensive survey of reinforcement learning algorithms, benchmarks, and applications in robotics and game playing.",
    year: 2021,
    journal: "Machine Learning Review",
    citations: 120
  }
];

export function PaperAnalysis() {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPapers = samplePapers.filter(paper => 
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    paper.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="grid md:grid-cols-12 gap-6">
      <div className="md:col-span-5 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-serif">Papers</CardTitle>
              <Button variant="outline" size="sm">
                <FileUp className="h-4 w-4 mr-1" />
                <span className="text-xs">Upload</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-3">
              {filteredPapers.map((paper) => (
                <Card 
                  key={paper.id} 
                  className={`cursor-pointer transition-colors hover:bg-slate-50 ${selectedPaper?.id === paper.id ? 'border-primary' : ''}`}
                  onClick={() => setSelectedPaper(paper)}
                >
                  <CardContent className="p-3">
                    <h4 className="font-medium line-clamp-2">{paper.title}</h4>
                    <p className="text-sm text-muted-foreground">{paper.authors}</p>
                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                      <span>{paper.year}, {paper.journal}</span>
                      <span>{paper.citations} citations</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredPapers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No papers found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-7">
        {selectedPaper ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">{selectedPaper.title}</CardTitle>
              <p className="text-muted-foreground">{selectedPaper.authors}</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary">
                <TabsList className="mb-4">
                  <TabsTrigger value="summary">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="full-text">
                    <FileText className="h-4 w-4 mr-1" />
                    Full Text
                  </TabsTrigger>
                  <TabsTrigger value="analysis">
                    <BarChart className="h-4 w-4 mr-1" />
                    Analysis
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Abstract</h4>
                      <p className="text-muted-foreground text-sm">{selectedPaper.abstract}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">AI-Generated Summary</h4>
                      <div className="bg-slate-50 p-3 rounded-md text-sm">
                        This paper presents significant findings in the field of {selectedPaper.title.split(" ").slice(-2).join(" ")}.
                        The authors demonstrate novel approaches to solving key challenges in this domain.
                        The methodology involves sophisticated algorithms and comprehensive evaluation on benchmark datasets.
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Key Points</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        <li>Introduces a new methodology for addressing core challenges</li>
                        <li>Achieves state-of-the-art results on benchmark datasets</li>
                        <li>Provides comprehensive analysis of limitations and future work</li>
                        <li>Demonstrates practical applications in real-world scenarios</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="full-text">
                  <div className="flex justify-center items-center h-64 border rounded-md">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">PDF Viewer would display here</p>
                      <Button variant="outline" className="mt-2">Open PDF</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">AI Analysis</h4>
                      <Textarea
                        placeholder="Ask AI to analyze specific aspects of this paper..."
                        className="resize-none h-24"
                      />
                      <Button className="mt-2" size="sm">Generate Analysis</Button>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-1">Citation Impact</h4>
                      <p className="text-sm text-muted-foreground">
                        This paper has been cited {selectedPaper.citations} times, ranking in the top 10% 
                        of papers published in {selectedPaper.year} in this field.
                      </p>
                      
                      <div className="h-4 bg-slate-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${Math.min(selectedPaper.citations / 2, 100)}%` }} 
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                        <span>150+</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center min-h-[30rem]">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Select a paper to view its details and analysis</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
