
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIInsightsPanel } from "@/components/research/AIInsightsPanel";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Image,
  FileText,
  MoreHorizontal,
  Save,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAIContent, createInsightFromAI, AIPromptType } from "@/utils/geminiAI";
import { supabase } from "@/integrations/supabase/client";

interface InsightProps {
  id: string;
  title: string;
  text: string;
  source: string;
  relevance: number;
}

interface DocumentEditorProps {
  initialTitle: string;
  initialContent: string;
  onSave: (title: string, content: string) => Promise<void>;
  onSaveInsight?: (insightData: {
    title: string;
    text: string;
    source: string;
    relevance: number;
  }) => Promise<void>;
  documentId?: string;
}

export function DocumentEditor({
  initialTitle,
  initialContent,
  onSave,
  onSaveInsight,
  documentId,
}: DocumentEditorProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [insights, setInsights] = useState<InsightProps[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load saved insights if there's a document ID
  useEffect(() => {
    async function loadInsights() {
      if (!documentId) return;
      
      try {
        const { data, error } = await supabase
          .from("insights")
          .select("*")
          .eq("document_id", documentId)
          .order("created_at", { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          setInsights(data);
        }
      } catch (error) {
        console.error("Error loading insights:", error);
      }
    }
    
    loadInsights();
  }, [documentId]);

  const handleToolClick = (tool: string) => {
    setActiveTool(tool === activeTool ? null : tool);
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(documentTitle, content);
    } catch (error) {
      console.error("Error in save handler:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your document.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIAnalyze = async (promptType: AIPromptType = 'analyze') => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    toast({
      title: "AI Analysis started",
      description: `Gemini AI is now ${promptType}ing your document. Results will appear in the insights panel.`,
    });

    try {
      const response = await generateAIContent(content, promptType);
      
      if (response.error) {
        toast({
          title: "AI Analysis failed",
          description: `Error: ${response.error}`,
          variant: "destructive",
        });
        return;
      }
      
      const newInsight = createInsightFromAI(response.text, promptType);
      
      // Save insight to database if document has been saved
      if (documentId && onSaveInsight) {
        await onSaveInsight({
          title: newInsight.title,
          text: newInsight.text,
          source: newInsight.source,
          relevance: newInsight.relevance,
        });
      }
      
      setInsights(prev => [newInsight, ...prev]);
      
      toast({
        title: "AI Analysis complete",
        description: `New insights have been added to the panel.`,
      });
    } catch (error) {
      console.error("Error during AI analysis:", error);
      toast({
        title: "AI Analysis failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="border-b bg-background sticky top-16 z-20">
        <div className="flex flex-col gap-1 px-4 py-3">
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-2xl font-serif font-bold bg-transparent border-none outline-none w-full"
            placeholder="Document Title"
          />
          
          <div className="flex flex-wrap items-center gap-1 py-1">
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "bold" ? "bg-accent" : ""}
              onClick={() => handleToolClick("bold")}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "italic" ? "bg-accent" : ""}
              onClick={() => handleToolClick("italic")}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "underline" ? "bg-accent" : ""}
              onClick={() => handleToolClick("underline")}
            >
              <Underline className="h-4 w-4" />
            </Button>
            
            <div className="h-4 w-px bg-border mx-1" />
            
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "alignLeft" ? "bg-accent" : ""}
              onClick={() => handleToolClick("alignLeft")}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "alignCenter" ? "bg-accent" : ""}
              onClick={() => handleToolClick("alignCenter")}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "alignRight" ? "bg-accent" : ""}
              onClick={() => handleToolClick("alignRight")}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            
            <div className="h-4 w-px bg-border mx-1" />
            
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "h1" ? "bg-accent" : ""}
              onClick={() => handleToolClick("h1")}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "h2" ? "bg-accent" : ""}
              onClick={() => handleToolClick("h2")}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            
            <div className="h-4 w-px bg-border mx-1" />
            
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "list" ? "bg-accent" : ""}
              onClick={() => handleToolClick("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "orderedList" ? "bg-accent" : ""}
              onClick={() => handleToolClick("orderedList")}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            <div className="h-4 w-px bg-border mx-1" />
            
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "image" ? "bg-accent" : ""}
              onClick={() => handleToolClick("image")}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={activeTool === "file" ? "bg-accent" : ""}
              onClick={() => handleToolClick("file")}
            >
              <FileText className="h-4 w-4" />
            </Button>
            
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    disabled={isAnalyzing}
                  >
                    <Zap className={`h-4 w-4 ${isAnalyzing ? "animate-pulse" : ""} text-research-600`} />
                    {isAnalyzing ? "Analyzing..." : "AI Tools"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Gemini AI Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAIAnalyze('analyze')}>
                    Analyze Content
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAIAnalyze('summarize')}>
                    Summarize Document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAIAnalyze('improve')}>
                    Suggest Improvements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAIAnalyze('brainstorm')}>
                    Generate Related Ideas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAIAnalyze('research')}>
                    Find Research Connections
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Document Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Export as Word</DropdownMenuItem>
                  <DropdownMenuItem>Share Document</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Document History</DropdownMenuItem>
                  <DropdownMenuItem>Document Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-6 md:px-12 md:py-8 lg:px-20 lg:py-10 md:mr-80">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[calc(100vh-16rem)] p-0 text-lg leading-relaxed font-sans bg-transparent border-none outline-none resize-none focus:ring-0"
        />
      </div>
      
      <AIInsightsPanel insights={insights} />
    </div>
  );
}
