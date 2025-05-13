
import { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InsightProps } from "@/components/research/AIInsightsPanel";

interface RichTextEditorProps {
  initialValue: string;
  onSave: (content: string) => void;
  applyAIContent?: (content: string | InsightProps) => void;
  aiContent?: string;
}

export function RichTextEditor({ 
  initialValue, 
  onSave, 
  applyAIContent,
  aiContent 
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialValue);
  const quillRef = useRef<ReactQuill>(null);
  const navigate = useNavigate();
  const [previousAiContent, setPreviousAiContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Effect to handle AI content application only when aiContent changes
  useEffect(() => {
    if (applyAIContent && aiContent && aiContent !== previousAiContent) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        // Get current selection or use the end of the document
        const range = quill.getSelection() || { index: quill.getText().length, length: 0 };
        
        // Process the content to properly format it
        // Remove "AI Generated" text if present
        let processedContent = aiContent.replace(/AI Generated/g, "").trim();
        
        // Apply formatting to improve readability
        processedContent = formatContentWithMarkdown(processedContent);
        
        // Insert formatted content at current position
        quill.clipboard.dangerouslyPasteHTML(range.index, processedContent);
        
        // Update state to track that we've processed this content
        setPreviousAiContent(aiContent);
        
        // Focus back on editor
        quill.focus();
      }
    }
  }, [aiContent, applyAIContent]);

  // Format content to improve readability with proper structure
  const formatContentWithMarkdown = (text: string) => {
    // Replace line breaks with HTML paragraph tags
    let formatted = text.replace(/\n\n/g, '</p><p>');
    
    // Format headings (if text has patterns like "Title:" or "Summary:")
    formatted = formatted.replace(/^([\w\s]+):\s*(.+)$/gm, '<h3>$1</h3><p>$2</p>');
    
    // Format lists if they exist
    formatted = formatted.replace(/^\s*[\-\*]\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.+<\/li>\s*)+/g, '<ul>$&</ul>');
    
    // Fix any double paragraph tags
    formatted = formatted.replace(/<\/p>\s*<p>/g, '</p><p>');
    
    // Ensure the content starts and ends with paragraph tags
    if (!formatted.startsWith('<h') && !formatted.startsWith('<p>')) {
      formatted = '<p>' + formatted;
    }
    if (!formatted.endsWith('</p>') && !formatted.endsWith('</ul>')) {
      formatted += '</p>';
    }
    
    return formatted;
  };

  const handleChange = (value: string) => {
    setContent(value);
    onSave(value);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link", "image",
    "align", "color", "background"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 bg-card p-2 rounded-md shadow-sm">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/dashboard")}
          className="gap-1 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 transition-all ${copied ? 'text-green-500' : ''}`}
          onClick={handleCopyContent}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Content"}
        </Button>
      </div>
      
      <style>
        {`
          .ql-editor {
            min-height: 400px;
            font-size: 16px;
            line-height: 1.7;
            color: #1f2937;
            padding: 16px 20px;
          }
          .ql-editor h1 {
            font-size: 1.8em;
            margin-top: 1.5em;
            margin-bottom: 0.8em;
            font-weight: 600;
          }
          .ql-editor h2 {
            font-size: 1.5em;
            margin-top: 1.3em;
            margin-bottom: 0.7em;
            font-weight: 600;
          }
          .ql-editor h3 {
            font-size: 1.3em;
            margin-top: 1.2em;
            margin-bottom: 0.6em;
            font-weight: 600;
          }
          .ql-editor p {
            margin-bottom: 1em;
          }
          .ql-editor ul {
            padding-left: 1.5em;
            margin-bottom: 1em;
          }
          .ql-editor li {
            margin-bottom: 0.5em;
          }
          .ql-toolbar {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background-color: #f8f9fa;
            border-color: #e5e7eb;
            padding: 10px;
          }
          .ql-container {
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            font-family: 'Inter', sans-serif;
            border-color: #e5e7eb;
          }
          .ql-snow .ql-tooltip {
            border-radius: 4px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          }
          .ql-snow .ql-picker {
            font-size: 14px;
          }
          .ql-snow .ql-stroke {
            stroke-width: 1.5;
          }
        `}
      </style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="flex-1 rounded-md shadow-sm border border-input"
        style={{ height: "calc(100% - 120px)" }}
      />
    </div>
  );
}
