
import { useState } from "react";
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

export function DocumentEditor() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState("Literature Review: Neural Networks in Computer Vision");
  const [content, setContent] = useState(`# Introduction to Neural Networks in Computer Vision

Computer vision has been revolutionized by deep learning approaches, particularly convolutional neural networks (CNNs). This literature review examines the progression of neural network architectures in computer vision tasks over the past decade.

## Background

Early approaches to computer vision relied on hand-crafted features and traditional machine learning algorithms. The introduction of AlexNet in 2012 marked a significant shift towards deep learning approaches, demonstrating substantial improvements in image classification performance on the ImageNet dataset.

## Current State of the Art

Recent architectures such as Vision Transformers (ViT) and MLP-Mixers have challenged the CNN paradigm by adapting transformer architectures from natural language processing to vision tasks. These approaches often eliminate convolutions entirely, relying instead on self-attention mechanisms or token mixing operations.

### Key Advantages

- Improved performance on benchmark datasets
- Better handling of global dependencies in images
- More efficient training on large datasets

## Research Gaps

Despite significant progress, several challenges remain:

1. Efficiency concerns for deployment on edge devices
2. Interpretability of complex models
3. Data efficiency for specialized domains
4. Robustness to adversarial attacks

## Proposed Research Direction

This project will focus on developing hybrid architectures that combine the strengths of CNNs and transformer-based approaches, with particular emphasis on medical imaging applications where data scarcity is a common challenge.`);

  const { toast } = useToast();

  const handleToolClick = (tool: string) => {
    setActiveTool(tool === activeTool ? null : tool);
  };

  const handleSave = () => {
    toast({
      title: "Document saved",
      description: "Your document has been saved successfully.",
    });
  };

  const handleAIAnalyze = () => {
    toast({
      title: "AI Analysis started",
      description: "The AI is now analyzing your document. Results will appear in the insights panel.",
    });
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
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleAIAnalyze}
              >
                <Zap className="h-4 w-4 text-research-600" />
                AI Analyze
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
                Save
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
      
      <AIInsightsPanel />
    </div>
  );
}
