
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { DocumentGridSkeleton } from "./DocumentGridSkeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, File, FileText, Plus, Clock, Trash, Edit, Book, FilePlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Document {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

export function DocumentGrid() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      return !!user;
    }

    async function fetchDocuments() {
      const authenticated = await checkAuth();
      
      if (!authenticated) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .order("updated_at", { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setDocuments(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to load documents. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [toast]);

  async function handleCreateDocument() {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a document.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: "Untitled Document",
          content: "",
          user_id: user?.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      navigate(`/document/${data.id}`);
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: "Failed to create a new document. Please try again.",
        variant: "destructive",
      });
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function truncateText(text: string, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDocumentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentToDelete);

      if (error) throw error;

      setDocuments(docs => docs.filter(doc => doc.id !== documentToDelete));
      toast({
        title: "Document deleted",
        description: "The document has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDocumentToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <DocumentGridSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="bg-muted rounded-full p-6">
          <Book size={64} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center">Sign In to Access Your Documents</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Create an account or sign in to start creating, editing, and organizing your research documents.
        </p>
        <div className="flex gap-4 mt-6">
          <Button>Sign In</Button>
          <Button variant="outline">Create Account</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold"><Folder className="inline-block mb-1" /> Documents</h1>
          <p className="text-muted-foreground mt-1">Create and manage your research documents</p>
        </div>
        <Button onClick={handleCreateDocument} className="gap-2">
          <FilePlus size={16} />
          New Document
        </Button>
      </div>
      
      {documents.length === 0 ? (
        <div className="border border-dashed rounded-lg p-12 text-center">
          <div className="mx-auto bg-muted rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No documents yet</h3>
          <p className="text-muted-foreground mb-6">Create your first document to get started</p>
          <Button onClick={handleCreateDocument} className="gap-2">
            <Plus size={16} />
            Create Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Link key={doc.id} to={`/document/${doc.id}`} className="block group">
              <Card className="h-full overflow-hidden hover:border-primary transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors flex items-center justify-between">{doc.title}{<File className="inline-block mb-2" />}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Clock size={12} />
                    Updated {formatDate(doc.updated_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {doc.content ? truncateText(doc.content.replace(/<[^>]*>/g, ''), 150) : "No content yet"}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center justify-between w-full">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs px-2">
                      <Edit size={14} />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeleteClick(e, doc.id)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
