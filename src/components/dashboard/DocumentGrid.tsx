
import { useState } from "react";
import { DocumentCard, DocumentCardProps } from "@/components/dashboard/DocumentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter } from "lucide-react";

// Sample document data
const sampleDocuments: DocumentCardProps[] = [
  {
    id: "1",
    title: "Literature Review: Neural Networks in Computer Vision",
    excerpt: "A comprehensive analysis of recent advancements in neural networks applied to computer vision tasks.",
    lastModified: "2 hours ago",
    category: "Literature Review",
    isFavorite: true,
    progress: 85,
  },
  {
    id: "2",
    title: "Research Proposal: Federated Learning for Healthcare Applications",
    excerpt: "Investigating privacy-preserving machine learning methods for sensitive healthcare data.",
    lastModified: "Yesterday",
    category: "Research Proposal",
    progress: 60,
  },
  {
    id: "3",
    title: "Thesis Introduction Draft",
    excerpt: "Introducing the problem statement, research questions, and methodology for my final year project.",
    lastModified: "3 days ago",
    category: "Thesis",
    progress: 30,
  },
  {
    id: "4",
    title: "Notes on Transformer Architecture",
    excerpt: "Key concepts and implementation details of the transformer neural network architecture.",
    lastModified: "1 week ago",
    category: "Notes",
    isFavorite: true,
  },
  {
    id: "5",
    title: "Meeting Summary: Project Supervisor Feedback",
    excerpt: "Notes from the meeting with Prof. Johnson regarding the project direction and next steps.",
    lastModified: "1 week ago",
    category: "Meeting Notes",
  },
  {
    id: "6",
    title: "Experiment Results: Dataset Comparison",
    excerpt: "Analysis of model performance using different datasets and preprocessing techniques.",
    lastModified: "2 weeks ago",
    category: "Experiment",
  },
];

export function DocumentGrid() {
  const [documents, setDocuments] = useState<DocumentCardProps[]>(sampleDocuments);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>All Documents</DropdownMenuItem>
              <DropdownMenuItem>Favorites</DropdownMenuItem>
              <DropdownMenuItem>Recent</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Literature Review</DropdownMenuItem>
              <DropdownMenuItem>Research Proposal</DropdownMenuItem>
              <DropdownMenuItem>Thesis</DropdownMenuItem>
              <DropdownMenuItem>Notes</DropdownMenuItem>
              <DropdownMenuItem>Meeting Notes</DropdownMenuItem>
              <DropdownMenuItem>Experiment</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>New Document</Button>
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} {...doc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
