
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaperSummary } from "@/components/research/PaperSummary";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Copy, ArrowDownToLine, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample citation data
const samplePaper = {
  id: "1",
  title: "Attention Is All You Need",
  authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit"],
  journal: "Neural Information Processing Systems",
  year: 2017,
  doi: "10.48550/arXiv.1706.03762",
  abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely...",
  summary: "This groundbreaking paper introduces the Transformer, a neural network architecture based entirely on attention mechanisms without using recurrence or convolutions. The Transformer achieves state-of-the-art results on machine translation tasks while being more parallelizable and requiring less training time than previous approaches.",
  keyFindings: [
    "Introduced the Transformer architecture based purely on attention mechanisms",
    "Achieved state-of-the-art results on WMT 2014 English-to-German and English-to-French translation tasks",
    "Demonstrated superior parallelization capabilities compared to RNN-based models",
    "Established multi-head self-attention as a powerful neural network component"
  ],
  methodologies: ["Self-Attention", "Multi-Head Attention", "Transformer", "Sequence Modeling"],
  relevanceScore: 95,
  fileUrl: "#"
};

const citationStyles = [
  { id: "apa", name: "APA", version: "7th Edition" },
  { id: "mla", name: "MLA", version: "9th Edition" },
  { id: "chicago", name: "Chicago", version: "17th Edition" },
  { id: "harvard", name: "Harvard", version: "" },
  { id: "ieee", name: "IEEE", version: "" },
  { id: "vancouver", name: "Vancouver", version: "" },
];

export function CitationManager() {
  const [activeTab, setActiveTab] = useState("preview");
  const [citationStyle, setCitationStyle] = useState("apa");
  const { toast } = useToast();

  const getFormattedCitation = () => {
    // This would typically interact with a citation formatting API
    // For now, we'll return styled examples based on the selected style
    switch (citationStyle) {
      case "apa":
        return "Vaswani, A., Shazeer, N., Parmar, N., & Uszkoreit, J. (2017). Attention is all you need. In Neural Information Processing Systems (pp. 5998-6008).";
      case "mla":
        return "Vaswani, Ashish, et al. \"Attention Is All You Need.\" Neural Information Processing Systems, 2017.";
      case "chicago":
        return "Vaswani, Ashish, Noam Shazeer, Niki Parmar, and Jakob Uszkoreit. \"Attention Is All You Need.\" In Neural Information Processing Systems, 5998-6008. 2017.";
      case "harvard":
        return "Vaswani, A., Shazeer, N., Parmar, N. and Uszkoreit, J. (2017). Attention Is All You Need. Neural Information Processing Systems, pp.5998-6008.";
      case "ieee":
        return "A. Vaswani, N. Shazeer, N. Parmar and J. Uszkoreit, \"Attention Is All You Need,\" Neural Information Processing Systems, pp. 5998-6008, 2017.";
      case "vancouver":
        return "Vaswani A, Shazeer N, Parmar N, Uszkoreit J. Attention Is All You Need. Neural Information Processing Systems. 2017:5998-6008.";
      default:
        return "Citation format not available";
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(getFormattedCitation());
    toast({
      title: "Citation copied",
      description: "The formatted citation has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PaperSummary {...samplePaper} />
        </div>

        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-serif font-medium mb-3">Citation Format</h3>
            <Select value={citationStyle} onValueChange={setCitationStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select citation style" />
              </SelectTrigger>
              <SelectContent>
                {citationStyles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name} {style.version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 p-3 bg-muted rounded-md text-sm">
              {getFormattedCitation()}
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="w-full" onClick={handleCopyCitation}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Citation
              </Button>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-serif font-medium mb-3">Add to Your Library</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Add to Bibliography
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" />
                Add to Reference Manager
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between p-4 border-b">
            <TabsList>
              <TabsTrigger value="preview">Similar Papers</TabsTrigger>
              <TabsTrigger value="search">Search References</TabsTrigger>
            </TabsList>

            {activeTab === "search" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for papers..." className="pl-9 w-[300px]" />
              </div>
            )}
          </div>

          <TabsContent value="preview" className="p-4">
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium">Similar papers feature</h3>
              <p className="mt-1">AI will analyze your document and suggest related papers</p>
            </div>
          </TabsContent>

          <TabsContent value="search" className="p-4">
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium">Search for academic papers</h3>
              <p className="mt-1">Enter keywords, titles, authors, or DOIs to find papers</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
