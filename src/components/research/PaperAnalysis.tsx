
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FileText, Upload, Download, Link, Search, ExternalLink } from "lucide-react";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  journal: string;
  keywords: string[];
  doi?: string;
  url?: string;
}

const SAMPLE_PAPERS: Paper[] = [
  {
    id: "1",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"],
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely...",
    year: 2017,
    journal: "Neural Information Processing Systems",
    keywords: ["transformer", "attention mechanism", "sequence modeling", "deep learning"],
    doi: "10.48550/arXiv.1706.03762",
    url: "https://arxiv.org/abs/1706.03762"
  },
  {
    id: "2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers...",
    year: 2018,
    journal: "NAACL",
    keywords: ["BERT", "language model", "transformer", "pre-training", "NLP"],
    doi: "10.48550/arXiv.1810.04805",
    url: "https://arxiv.org/abs/1810.04805"
  },
  {
    id: "3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder", "Melanie Subbiah"],
    abstract: "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples. By contrast, humans can generally perform a new language task from only a few examples or from simple instructions...",
    year: 2020,
    journal: "NeurIPS",
    keywords: ["GPT-3", "language model", "few-shot learning", "transfer learning"],
    doi: "10.48550/arXiv.2005.14165",
    url: "https://arxiv.org/abs/2005.14165"
  }
];

export function PaperAnalysis() {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  
  const filteredPapers = SAMPLE_PAPERS.filter(paper => 
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectPaper = (paper: Paper) => {
    setSelectedPaper(paper);
    setActiveTab("analysis");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="search">Search Papers</TabsTrigger>
            <TabsTrigger value="upload">Upload Paper</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!selectedPaper}>Paper Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by title, author, or keywords..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPapers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No papers found matching your search criteria.</p>
                  ) : (
                    filteredPapers.map(paper => (
                      <Card 
                        key={paper.id} 
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleSelectPaper(paper)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-serif font-medium">{paper.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {paper.authors.join(", ")} • {paper.year} • {paper.journal}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="mt-1">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm mt-3 line-clamp-2">{paper.abstract}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {paper.keywords.map(keyword => (
                              <span 
                                key={keyword} 
                                className="px-2 py-0.5 bg-muted rounded-full text-xs"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Research Paper</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="mx-auto bg-muted rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Upload Document</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Drag and drop your PDF or click to browse. Max file size: 20MB
                    </p>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Import from URL</label>
                      <div className="flex gap-2">
                        <Input placeholder="https://arxiv.org/pdf/..." />
                        <Button variant="outline">
                          <Link className="h-4 w-4 mr-2" />
                          Import
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-2">Import by DOI</label>
                      <div className="flex gap-2">
                        <Input placeholder="10.1038/s41586..." />
                        <Button variant="outline">
                          <Search className="h-4 w-4 mr-2" />
                          Lookup
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis">
            {selectedPaper && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPaper.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {selectedPaper.authors.join(", ")} • {selectedPaper.year} • {selectedPaper.journal}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Abstract</h3>
                      <p className="text-sm">{selectedPaper.abstract}</p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">AI Analysis</h3>
                      <div className="grid gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Key Findings</h4>
                          <ul className="text-sm list-disc pl-5">
                            <li>Introduced the Transformer architecture based on attention mechanisms</li>
                            <li>Eliminates the need for recurrent and convolutional layers</li>
                            <li>Achieves state-of-the-art performance while being more parallelizable</li>
                            <li>Significantly reduced training time compared to previous approaches</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Methodology</h4>
                          <p className="text-sm">The paper proposes a neural network architecture called the Transformer that uses self-attention mechanisms to compute representations of input and output sequences without using recurrent or convolutional layers. The model employs multi-head attention to jointly attend to information from different positions and representation spaces.</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Citations Impact</h4>
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <p>This paper has been cited over 65,000 times and is considered one of the most influential works in modern deep learning. It has led to the development of numerous other models including BERT, GPT, and T5.</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Analysis Notes</h4>
                          <Textarea placeholder="Add your notes about this paper..." className="min-h-[100px]" />
                          <Button size="sm" className="mt-2">Save Notes</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Paper Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start" disabled={!selectedPaper}>
                <FileText className="h-4 w-4 mr-2" />
                View Full Text
              </Button>
              
              <Button variant="outline" className="justify-start" disabled={!selectedPaper}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              
              <Button variant="outline" className="justify-start" disabled={!selectedPaper}>
                <FileText className="h-4 w-4 mr-2" />
                Add to Citations
              </Button>
              
              {selectedPaper?.doi && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">DOI</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                      {selectedPaper.doi}
                    </code>
                    <Button variant="ghost" size="sm">
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {selectedPaper && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Related Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SAMPLE_PAPERS
                  .filter(paper => paper.id !== selectedPaper.id)
                  .slice(0, 2)
                  .map(paper => (
                    <div 
                      key={paper.id}
                      className="p-3 border rounded-md hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleSelectPaper(paper)}
                    >
                      <h4 className="font-medium text-sm">{paper.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {paper.authors[0]} et al. • {paper.year}
                      </p>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
