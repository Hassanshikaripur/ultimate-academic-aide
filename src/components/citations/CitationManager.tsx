import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Copy, Download, Plus, Edit, Trash, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CitationForm, CitationFormValues } from "./CitationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Citation {
  id: string;
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi?: string;
  url?: string;
  abstract?: string;
}

const sampleCitations: Citation[] = [
  {
    id: "1",
    title: "Attention Is All You Need",
    authors: "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J.",
    year: "2017",
    journal: "Neural Information Processing Systems",
    doi: "10.48550/arXiv.1706.03762",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
  },
  {
    id: "2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Devlin, J., Chang, M.W., Lee, K., Toutanova, K.",
    year: "2018",
    journal: "NAACL",
    doi: "10.48550/arXiv.1810.04805",
    abstract: "We introduce a new language representation model called BERT...",
  },
  {
    id: "3",
    title: "Deep Residual Learning for Image Recognition",
    authors: "He, K., Zhang, X., Ren, S., Sun, J.",
    year: "2016",
    journal: "IEEE Conference on Computer Vision and Pattern Recognition",
    doi: "10.1109/CVPR.2016.90",
    abstract: "Deeper neural networks are more difficult to train...",
  },
];

const citationStyles = [
  { id: "apa", name: "APA", version: "7th Edition" },
  { id: "mla", name: "MLA", version: "9th Edition" },
  { id: "chicago", name: "Chicago", version: "17th Edition" },
  { id: "harvard", name: "Harvard", version: "" },
  { id: "ieee", name: "IEEE", version: "" },
  { id: "bibtex", name: "BibTeX", version: "" },
];

export function CitationManager() {
  const [activeTab, setActiveTab] = useState("all");
  const [citationStyle, setCitationStyle] = useState("apa");
  const [searchTerm, setSearchTerm] = useState("");
  const [citations, setCitations] = useState<Citation[]>(sampleCitations);
  const [formattedCitation, setFormattedCitation] = useState("");
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [citationToDelete, setCitationToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    if (selectedCitation) {
      setFormattedCitation(formatCitation(selectedCitation, citationStyle));
    }
  }, [selectedCitation, citationStyle]);

  const filteredCitations = citations.filter((citation) =>
    citation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citation.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citation.journal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCitation = (citation: Citation) => {
    setSelectedCitation(citation);
  };

  const formatCitation = (citation: Citation, style: string) => {
    const { authors, title, year, journal, doi } = citation;
    
    switch (style) {
      case "apa":
        return `${authors} (${year}). ${title}. ${journal}.${doi ? ` https://doi.org/${doi}` : ""}`;
      case "mla":
        return `${authors}. "${title}." ${journal}, ${year}.${doi ? ` DOI: ${doi}` : ""}`;
      case "chicago":
        return `${authors}. "${title}." ${journal} (${year}).${doi ? ` https://doi.org/${doi}` : ""}`;
      case "harvard":
        return `${authors} (${year}) '${title}', ${journal}.${doi ? ` doi: ${doi}` : ""}`;
      case "ieee":
        return `${authors}, "${title}," ${journal}, ${year}.${doi ? ` doi: ${doi}` : ""}`;
      case "bibtex":
        const authorLastName = authors.split(',')[0].trim();
        return `@article{${authorLastName}${year},
  author = {${authors}},
  title = {${title}},
  journal = {${journal}},
  year = {${year}}${doi ? `,
  doi = {${doi}}` : ""}
}`;
      default:
        return `${authors} (${year}). ${title}. ${journal}.`;
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(formattedCitation);
    toast({
      title: "Citation copied",
      description: "The formatted citation has been copied to your clipboard.",
    });
  };

  const handleDownloadCitation = () => {
    const element = document.createElement("a");
    const fileExtension = citationStyle === "bibtex" ? "bib" : "txt";
    const file = new Blob([formattedCitation], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `citation-${selectedCitation?.id}.${fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Citation downloaded",
      description: `The ${citationStyle.toUpperCase()} citation has been downloaded.`,
    });
  };

  const handleAddCitation = (data: CitationFormValues) => {
    // Fix: Ensure all required properties are provided
    const newCitation: Citation = {
      id: `citation-${Date.now()}`,
      title: data.title,
      authors: data.authors,
      year: data.year,
      journal: data.journal,
      doi: data.doi,
      url: data.url,
      abstract: data.abstract
    };
    
    setCitations((prev) => [...prev, newCitation]);
    setSelectedCitation(newCitation);
    
    toast({
      title: "Citation added",
      description: "The new citation has been added to your library.",
    });
  };

  const handleEditCitation = (data: CitationFormValues) => {
    if (!selectedCitation) return;
    
    setCitations((prev) =>
      prev.map((citation) =>
        citation.id === selectedCitation.id
          ? { ...citation, ...data }
          : citation
      )
    );
    
    setSelectedCitation((prev) => prev ? { ...prev, ...data } : null);
    
    toast({
      title: "Citation updated",
      description: "The citation has been updated successfully.",
    });
  };

  const handleDeleteClick = (id: string) => {
    setCitationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCitation = () => {
    if (!citationToDelete) return;
    
    setCitations((prev) => prev.filter((citation) => citation.id !== citationToDelete));
    
    if (selectedCitation?.id === citationToDelete) {
      setSelectedCitation(null);
    }
    
    setIsDeleteDialogOpen(false);
    setCitationToDelete(null);
    
    toast({
      title: "Citation deleted",
      description: "The citation has been removed from your library.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold">Citation Manager</h1>
          <p className="text-muted-foreground">Organize, format, and export your research references</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Citation
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b pb-3">
          <TabsList>
            <TabsTrigger value="all">All Citations</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search citations..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="all" className="pt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Authors</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Journal/Source</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCitations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No citations found. Add your first citation to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCitations.map((citation) => (
                    <TableRow 
                      key={citation.id}
                      onClick={() => handleSelectCitation(citation)}
                      className={`cursor-pointer ${selectedCitation?.id === citation.id ? 'bg-muted/50' : ''}`}
                    >
                      <TableCell className="font-medium">{citation.title}</TableCell>
                      <TableCell>{citation.authors}</TableCell>
                      <TableCell>{citation.year}</TableCell>
                      <TableCell>{citation.journal}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCitation(citation);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(citation.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="py-10 text-center text-muted-foreground">
            <p>Your recent citations will appear here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="py-10 text-center text-muted-foreground">
            <p>Your favorite citations will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedCitation && (
        <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Citation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Title</dt>
                  <dd className="mt-1">{selectedCitation.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Authors</dt>
                  <dd className="mt-1">{selectedCitation.authors}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                  <dd className="mt-1">{selectedCitation.year}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Journal/Source</dt>
                  <dd className="mt-1">{selectedCitation.journal}</dd>
                </div>
                {selectedCitation.doi && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">DOI</dt>
                    <dd className="mt-1">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {selectedCitation.doi}
                      </code>
                    </dd>
                  </div>
                )}
                {selectedCitation.abstract && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Abstract</dt>
                    <dd className="mt-1 text-sm">{selectedCitation.abstract}</dd>
                  </div>
                )}
              </dl>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Formatted Citation</h3>
                  <Select value={citationStyle} onValueChange={setCitationStyle}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Citation style" />
                    </SelectTrigger>
                    <SelectContent>
                      {citationStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name} {style.version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className={`p-3 bg-muted rounded-md whitespace-pre-wrap ${citationStyle === "bibtex" ? "font-mono text-xs" : "text-sm"}`}>
                  {formattedCitation}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="gap-2 flex-1" onClick={handleCopyCitation}>
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" className="gap-2 flex-1" onClick={handleDownloadCitation}>
                    <Download className="h-4 w-4" />
                    Download as {citationStyle === "bibtex" ? ".bib" : ".txt"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Citation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clipboard className="h-4 w-4 mr-2" />
                  Add to Document
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleCopyCitation}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Citation
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive" onClick={() => handleDeleteClick(selectedCitation.id)}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Citation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Add Citation Dialog */}
      <CitationForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddCitation}
        mode="add"
      />
      
      {/* Edit Citation Dialog */}
      {selectedCitation && (
        <CitationForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleEditCitation}
          defaultValues={{
            title: selectedCitation.title,
            authors: selectedCitation.authors,
            year: selectedCitation.year,
            journal: selectedCitation.journal,
            doi: selectedCitation.doi || "",
            url: selectedCitation.url || "",
            abstract: selectedCitation.abstract || "",
          }}
          mode="edit"
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Citation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this citation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCitation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
