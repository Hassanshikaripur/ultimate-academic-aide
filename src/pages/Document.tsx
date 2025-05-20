
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/layout/AppSidebar";
import { DocumentEditor } from "@/components/document/DocumentEditor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CustomAppHeader } from "@/components/layout/CustomAppHeader";

const Document = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documentData, setDocumentData] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view this document",
          variant: "destructive",
        });
        navigate("/");
        return false;
      }
      return true;
    }
    
    async function fetchDocument() {
      if (!id) {
        setLoading(false);
        return;
      }
      
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;
      
      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("id", id)
          .maybeSingle();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setDocumentData(data);
        } else {
          toast({
            title: "Document not found",
            description: "The document you're looking for doesn't exist or you don't have permission to view it.",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        toast({
          title: "Error",
          description: "Failed to load the document. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchDocument();
  }, [id, navigate, toast]);
  
  const handleSave = async (title: string, content: string) => {
    try {
      if (!id) {
        // Create new document
        const { data, error } = await supabase
          .from("documents")
          .insert({
            title,
            content,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Navigate to the new document
        navigate(`/document/${data.id}`);
        
        toast({
          title: "Document created",
          description: "Your document has been created successfully.",
        });
      } else {
        // Update existing document
        const { error } = await supabase
          .from("documents")
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq("id", id);
          
        if (error) throw error;
        
        toast({
          title: "Document saved",
          description: "Your document has been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save the document. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveInsight = async (insightData: {
    title: string;
    text: string;
    source: string;
    relevance: number;
  }) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from("insights")
        .insert({
          document_id: id,
          title: insightData.title,
          text: insightData.text,
          source: insightData.source,
          relevance: insightData.relevance,
        });
        
      if (error) throw error;
      
      toast({
        title: "Insight saved",
        description: "The AI insight has been saved to your document.",
      });
    } catch (error) {
      console.error("Error saving insight:", error);
      toast({
        title: "Error",
        description: "Failed to save the insight. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      
      <div className="flex-1 ml-0 md:ml-64">
        <CustomAppHeader />
        <main className="w-full">
          {loading ? (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading document...</p>
              </div>
            </div>
          ) : (
            <DocumentEditor 
              initialTitle={documentData?.title || "Untitled Document"} 
              initialContent={documentData?.content || ""} 
              onSave={handleSave}
              onSaveInsight={handleSaveInsight}
              documentId={id}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Document;
