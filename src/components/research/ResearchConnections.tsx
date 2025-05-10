
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";

// Sample connections data
const connections = [
  {
    id: "1",
    title: "Attention Models in Computer Vision",
    papers: [
      { title: "Transformers for Image Recognition", year: 2020, journal: "Journal of Computer Vision", authors: "Zhang et al." },
      { title: "Visual Transformers at Scale", year: 2021, journal: "CVPR Proceedings", authors: "Chen et al." },
      { title: "Self-Attention for Visual Recognition", year: 2019, journal: "ArXiv Preprint", authors: "Li et al." }
    ],
    strength: "strong"
  },
  {
    id: "2",
    title: "Neural Networks in Natural Language Processing",
    papers: [
      { title: "BERT: Pre-training of Deep Bidirectional Transformers", year: 2018, journal: "Computational Linguistics", authors: "Devlin et al." },
      { title: "GPT-3: Language Models are Few-Shot Learners", year: 2020, journal: "NeurIPS Proceedings", authors: "Brown et al." }
    ],
    strength: "moderate"
  },
  {
    id: "3",
    title: "Transfer Learning Applications",
    papers: [
      { title: "Transfer Learning for Medical Image Analysis", year: 2022, journal: "Medical AI Journal", authors: "Johnson et al." },
      { title: "Few-Shot Learning in Computer Vision", year: 2021, journal: "ECCV Proceedings", authors: "Wang et al." },
      { title: "Domain Adaptation with Minimal Data", year: 2020, journal: "Pattern Recognition Letters", authors: "Park et al." }
    ],
    strength: "weak"
  }
];

export function ResearchConnections() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("strength");
  
  // Filter and sort connections
  const filteredConnections = connections
    .filter(connection => {
      if (filter === "all") return true;
      return connection.strength === filter;
    })
    .sort((a, b) => {
      if (sortBy === "strength") {
        const strengthOrder = { strong: 3, moderate: 2, weak: 1 };
        return strengthOrder[b.strength] - strengthOrder[a.strength];
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Network className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-medium">Research Connection Finder</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connection Strength</CardTitle>
                <CardDescription>Filter by connection strength</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="all" onValueChange={setFilter} value={filter}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Connections</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="strong" id="strong" />
                    <Label htmlFor="strong">Strong</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weak" id="weak" />
                    <Label htmlFor="weak">Weak</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sort Options</CardTitle>
                <CardDescription>Choose how to sort connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={sortBy === "strength" ? "default" : "outline"} 
                    onClick={() => setSortBy("strength")}
                    size="sm"
                  >
                    By Strength
                  </Button>
                  <Button 
                    variant={sortBy === "alphabetical" ? "default" : "outline"} 
                    onClick={() => setSortBy("alphabetical")}
                    size="sm"
                  >
                    Alphabetical
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredConnections.map((connection) => (
          <Card key={connection.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{connection.title}</CardTitle>
                <div className={`px-3 py-1 text-xs rounded-full 
                  ${connection.strength === "strong" 
                    ? "bg-emerald-100 text-emerald-800" 
                    : connection.strength === "moderate"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {connection.strength.charAt(0).toUpperCase() + connection.strength.slice(1)}
                </div>
              </div>
              <CardDescription>
                {connection.papers.length} connected papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list">
                <TabsList className="mb-4">
                  <TabsTrigger value="list">Paper List</TabsTrigger>
                  <TabsTrigger value="details">Connection Details</TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="space-y-2">
                  {connection.papers.map((paper, idx) => (
                    <div key={idx} className="p-3 border rounded-md">
                      <h4 className="font-medium">{paper.title}</h4>
                      <p className="text-sm text-muted-foreground">{paper.authors} • {paper.year} • {paper.journal}</p>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="details">
                  <p className="text-muted-foreground mb-4">
                    This connection was found based on {connection.papers.length} papers that share common themes, 
                    methodologies, or citation patterns. The strength is determined by the number of shared citations
                    and semantic similarity.
                  </p>
                  <Button variant="outline" size="sm">View Detailed Analysis</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
