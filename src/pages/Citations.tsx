
import { useState } from "react";
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Download, Edit, Plus, Search, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Sample citation data
const sampleCitations = [
  {
    id: "1",
    title: "Large Language Models and Knowledge Graphs",
    authors: "Chen, E., Johnson, R., & Williams, S.",
    year: "2024",
    journal: "Journal of Artificial Intelligence Research",
    volume: "42",
    issue: "3",
    pages: "123-145",
    doi: "10.1234/jair.2024.1234",
    url: "https://example.com/papers/1",
    tags: ["LLM", "Knowledge Graphs"]
  },
  {
    id: "2",
    title: "Advances in Neural Machine Translation",
    authors: "Smith, J. & Brown, T.",
    year: "2023",
    journal: "Computational Linguistics",
    volume: "39",
    issue: "2",
    pages: "45-72",
    doi: "10.1234/cl.2023.5678",
    url: "https://example.com/papers/2",
    tags: ["NLP", "Translation"]
  },
  {
    id: "3",
    title: "Reinforcement Learning for Robotics Applications",
    authors: "Garcia, M., Wilson, J., & Lee, K.",
    year: "2022",
    journal: "Robotics and Autonomous Systems",
    volume: "128",
    issue: "1",
    pages: "78-96",
    doi: "10.1234/ras.2022.9012",
    url: "https://example.com/papers/3",
    tags: ["RL", "Robotics"]
  },
];

// Citation format types
const citationFormats = {
  apa: "APA",
  mla: "MLA",
  chicago: "Chicago",
  harvard: "Harvard",
  ieee: "IEEE",
  bibtex: "BibTeX"
};

const Citations = () => {
  const [citations, setCitations] = useState(sampleCitations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("apa");
  const [editingCitation, setEditingCitation] = useState<any>(null);
  const [newCitation, setNewCitation] = useState({
    id: "",
    title: "",
    authors: "",
    year: "",
    journal: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    url: "",
    tags: []
  });
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();

  const filteredCitations = citations.filter(citation => 
    citation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    citation.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
    citation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (citation: any) => {
    setEditingCitation({ ...citation });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setCitations(prev => prev.map(c => c.id === editingCitation.id ? editingCitation : c));
    setIsEditDialogOpen(false);
    toast({
      title: "Citation updated",
      description: "Your changes have been saved successfully."
    });
  };

  const handleDelete = (id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Citation deleted",
      description: "The citation has been removed from your library."
    });
  };

  const handleCopy = (citation: any, format: string) => {
    let formattedCitation;
    
    switch(format) {
      case 'apa':
        formattedCitation = `${citation.authors} (${citation.year}). ${citation.title}. ${citation.journal}, ${citation.volume}(${citation.issue}), ${citation.pages}. https://doi.org/${citation.doi}`;
        break;
      case 'bibtex':
        formattedCitation = `@article{${citation.authors.split(',')[0].toLowerCase()}${citation.year},
  author = {${citation.authors}},
  title = {${citation.title}},
  journal = {${citation.journal}},
  year = {${citation.year}},
  volume = {${citation.volume}},
  number = {${citation.issue}},
  pages = {${citation.pages}},
  doi = {${citation.doi}}
}`;
        break;
      default:
        formattedCitation = `${citation.authors} (${citation.year}). ${citation.title}. ${citation.journal}, ${citation.volume}(${citation.issue}), ${citation.pages}.`;
    }
    
    navigator.clipboard.writeText(formattedCitation);
    toast({
      title: "Copied to clipboard",
      description: `Citation copied in ${citationFormats[format as keyof typeof citationFormats]} format.`
    });
  };

  const handleCreateNew = () => {
    const newId = (Math.max(...citations.map(c => parseInt(c.id))) + 1).toString();
    const finalCitation = {
      ...newCitation,
      id: newId,
      tags: newCitation.tags || []
    };
    
    setCitations(prev => [...prev, finalCitation]);
    setIsNewDialogOpen(false);
    setNewCitation({
      id: "",
      title: "",
      authors: "",
      year: "",
      journal: "",
      volume: "",
      issue: "",
      pages: "",
      doi: "",
      url: "",
      tags: []
    });
    
    toast({
      title: "New citation added",
      description: "The citation has been added to your library."
    });
  };

  const renderCitationByFormat = (citation: any, format: string) => {
    switch(format) {
      case 'apa':
        return `${citation.authors} (${citation.year}). ${citation.title}. ${citation.journal}, ${citation.volume}(${citation.issue}), ${citation.pages}.`;
      case 'mla':
        return `${citation.authors}. "${citation.title}." ${citation.journal}, vol. ${citation.volume}, no. ${citation.issue}, ${citation.year}, pp. ${citation.pages}.`;
      case 'chicago':
        return `${citation.authors}. "${citation.title}." ${citation.journal} ${citation.volume}, no. ${citation.issue} (${citation.year}): ${citation.pages}.`;
      case 'harvard':
        return `${citation.authors} ${citation.year}, '${citation.title}', ${citation.journal}, vol. ${citation.volume}, no. ${citation.issue}, pp. ${citation.pages}.`;
      case 'ieee':
        return `${citation.authors}, "${citation.title}," ${citation.journal}, vol. ${citation.volume}, no. ${citation.issue}, pp. ${citation.pages}, ${citation.year}.`;
      case 'bibtex':
        return `@article{${citation.authors.split(',')[0].toLowerCase()}${citation.year},
  author = {${citation.authors}},
  title = {${citation.title}},
  journal = {${citation.journal}},
  year = {${citation.year}},
  volume = {${citation.volume}},
  number = {${citation.issue}},
  pages = {${citation.pages}},
  doi = {${citation.doi}}
}`;
      default:
        return `${citation.authors} (${citation.year}). ${citation.title}.`;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <CustomAppHeader />
        <main className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-serif font-bold">Citations</h1>
              <p className="text-muted-foreground mt-1">Manage and format your research citations</p>
            </div>
            
            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Citation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Citation</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new citation. Required fields are marked with an asterisk (*).
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-title">Title *</Label>
                      <Input 
                        id="new-title" 
                        value={newCitation.title} 
                        onChange={(e) => setNewCitation({...newCitation, title: e.target.value})} 
                        placeholder="Paper title"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-authors">Authors *</Label>
                        <Input 
                          id="new-authors" 
                          value={newCitation.authors} 
                          onChange={(e) => setNewCitation({...newCitation, authors: e.target.value})} 
                          placeholder="Author names (e.g., Smith, J. & Lee, K.)"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-year">Year *</Label>
                        <Input 
                          id="new-year" 
                          value={newCitation.year} 
                          onChange={(e) => setNewCitation({...newCitation, year: e.target.value})} 
                          placeholder="Publication year"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-journal">Journal/Source *</Label>
                      <Input 
                        id="new-journal" 
                        value={newCitation.journal} 
                        onChange={(e) => setNewCitation({...newCitation, journal: e.target.value})} 
                        placeholder="Journal or source name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-volume">Volume</Label>
                        <Input 
                          id="new-volume" 
                          value={newCitation.volume} 
                          onChange={(e) => setNewCitation({...newCitation, volume: e.target.value})} 
                          placeholder="Volume"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-issue">Issue</Label>
                        <Input 
                          id="new-issue" 
                          value={newCitation.issue} 
                          onChange={(e) => setNewCitation({...newCitation, issue: e.target.value})} 
                          placeholder="Issue"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-pages">Pages</Label>
                        <Input 
                          id="new-pages" 
                          value={newCitation.pages} 
                          onChange={(e) => setNewCitation({...newCitation, pages: e.target.value})} 
                          placeholder="Page range"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-doi">DOI</Label>
                        <Input 
                          id="new-doi" 
                          value={newCitation.doi} 
                          onChange={(e) => setNewCitation({...newCitation, doi: e.target.value})} 
                          placeholder="Digital Object Identifier"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-url">URL</Label>
                        <Input 
                          id="new-url" 
                          value={newCitation.url} 
                          onChange={(e) => setNewCitation({...newCitation, url: e.target.value})} 
                          placeholder="URL to paper"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-tags">Tags (comma separated)</Label>
                      <Input 
                        id="new-tags" 
                        placeholder="AI, Machine Learning, NLP" 
                        onChange={(e) => setNewCitation({...newCitation, tags: e.target.value.split(',').map(tag => tag.trim())})}
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateNew} disabled={!newCitation.title || !newCitation.authors || !newCitation.year || !newCitation.journal}>
                    Create Citation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Dialog for editing */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Citation</DialogTitle>
                <DialogDescription>
                  Make changes to your citation details.
                </DialogDescription>
              </DialogHeader>
              
              {editingCitation && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input 
                        id="edit-title" 
                        value={editingCitation.title} 
                        onChange={(e) => setEditingCitation({...editingCitation, title: e.target.value})} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-authors">Authors</Label>
                        <Input 
                          id="edit-authors" 
                          value={editingCitation.authors} 
                          onChange={(e) => setEditingCitation({...editingCitation, authors: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-year">Year</Label>
                        <Input 
                          id="edit-year" 
                          value={editingCitation.year} 
                          onChange={(e) => setEditingCitation({...editingCitation, year: e.target.value})} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-journal">Journal/Source</Label>
                      <Input 
                        id="edit-journal" 
                        value={editingCitation.journal} 
                        onChange={(e) => setEditingCitation({...editingCitation, journal: e.target.value})} 
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-volume">Volume</Label>
                        <Input 
                          id="edit-volume" 
                          value={editingCitation.volume} 
                          onChange={(e) => setEditingCitation({...editingCitation, volume: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-issue">Issue</Label>
                        <Input 
                          id="edit-issue" 
                          value={editingCitation.issue} 
                          onChange={(e) => setEditingCitation({...editingCitation, issue: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-pages">Pages</Label>
                        <Input 
                          id="edit-pages" 
                          value={editingCitation.pages} 
                          onChange={(e) => setEditingCitation({...editingCitation, pages: e.target.value})} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-doi">DOI</Label>
                        <Input 
                          id="edit-doi" 
                          value={editingCitation.doi} 
                          onChange={(e) => setEditingCitation({...editingCitation, doi: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-url">URL</Label>
                        <Input 
                          id="edit-url" 
                          value={editingCitation.url} 
                          onChange={(e) => setEditingCitation({...editingCitation, url: e.target.value})} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                      <Input 
                        id="edit-tags" 
                        value={editingCitation.tags.join(', ')} 
                        onChange={(e) => setEditingCitation({...editingCitation, tags: e.target.value.split(',').map((tag: string) => tag.trim())})}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-8/12 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Citation Library</CardTitle>
                    <div className="w-[240px]">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search citations..." 
                          className="pl-8" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredCitations.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No citations found. Add a new citation or try a different search term.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCitations.map(citation => (
                        <Card key={citation.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium">{citation.title}</h3>
                                <p className="text-sm text-muted-foreground">{citation.authors}, {citation.year}</p>
                                <p className="text-sm text-muted-foreground">{citation.journal}, {citation.volume}({citation.issue}), {citation.pages}</p>
                                <div className="flex gap-1 mt-2">
                                  {citation.tags.map((tag: string, i: number) => (
                                    <div key={i} className="bg-slate-100 text-xs px-2 py-0.5 rounded">
                                      {tag}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(citation, selectedFormat)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(citation)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(citation.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-4/12 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Citation Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="apa" onValueChange={setSelectedFormat}>
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="apa">APA</TabsTrigger>
                      <TabsTrigger value="mla">MLA</TabsTrigger>
                      <TabsTrigger value="bibtex">BibTeX</TabsTrigger>
                    </TabsList>
                    
                    {filteredCitations.length > 0 && (
                      <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded border">
                          <pre className="text-xs whitespace-pre-wrap">
                            {renderCitationByFormat(filteredCitations[0], selectedFormat)}
                          </pre>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCopy(filteredCitations[0], selectedFormat)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export All
                          </Button>
                        </div>
                      </div>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Import Citations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">Import BibTeX</Button>
                  <Button variant="outline" className="w-full">Import DOI</Button>
                  <Button variant="outline" className="w-full">Import from PDF</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Citations;
