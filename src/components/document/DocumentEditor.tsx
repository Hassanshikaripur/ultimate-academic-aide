
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
  MoreHorizontal,
  Save,
  Zap,
  FileDown,
  Trash2,
  Share2,
  Download,
  Code,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAIContent, createInsightFromAI, AIPromptType } from "@/utils/geminiAI";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "./RichTextEditor";

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
  const [documentTitle, setDocumentTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [insights, setInsights] = useState<InsightProps[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string>("");
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

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(documentTitle, content);
      toast({
        title: "Document saved",
        description: "Your document has been successfully saved.",
      });
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
      setAiGeneratedContent(response.text);
      
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

  // Handle code formatting AI task
  const handleCodeFormatting = async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    toast({
      title: "Code formatting started",
      description: "AI is formatting code blocks in your document...",
    });

    try {
      // Custom prompt for code formatting
      const codeFormattingPrompt = `
        Find all code blocks in the following document and format them properly.
        For each code block:
        1. Detect the programming language
        2. Apply proper indentation and syntax formatting
        3. Return the formatted code blocks with language identified
        
        If you don't find any code blocks, suggest how to format the document content for better readability.
        
        Document content: ${content}
      `;
      
      const response = await generateAIContent(codeFormattingPrompt, 'analyze');
      
      if (response.error) {
        toast({
          title: "Code formatting failed",
          description: `Error: ${response.error}`,
          variant: "destructive",
        });
        return;
      }
      
      const newInsight = {
        id: `insight-code-${Date.now()}`,
        title: "Code Formatting",
        text: response.text,
        source: "Gemini AI",
        relevance: 95
      };
      
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
      setAiGeneratedContent(response.text);
      
      toast({
        title: "Code formatting complete",
        description: "The formatted code is available in the insights panel.",
      });
    } catch (error) {
      console.error("Error during code formatting:", error);
      toast({
        title: "Code formatting failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle clear insights
  const handleClearInsights = () => {
    setInsights([]);
    toast({
      title: "Insights cleared",
      description: "All AI insights have been removed from the panel.",
    });
  };

  // Fix: Update the applyAIContent function to use the text property from InsightProps
  const applyAIContent = (content: string | InsightProps) => {
    if (typeof content === 'string') {
      setAiGeneratedContent(content);
    } else {
      // If content is an InsightProps object, use its text property
      setAiGeneratedContent(content.text);
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
                <DropdownMenuContent align="end" className="w-56">
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCodeFormatting}>
                    <Code className="h-4 w-4 mr-2" />
                    Format Code Blocks
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Document Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export as Word
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Document
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-6 md:px-12 md:py-8 lg:px-20 lg:py-10 md:mr-80">
        <RichTextEditor 
          initialValue={content}
          onSave={handleContentChange}
          applyAIContent={applyAIContent}
          aiContent={aiGeneratedContent}
        />
      </div>
      
      <AIInsightsPanel 
        insights={insights} 
        onApplyInsight={(insight) => applyAIContent(insight)}
        onClearInsights={handleClearInsights}
      />
    </div>
  );
}
