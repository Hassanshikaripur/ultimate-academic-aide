import { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
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
        const range = quill.getSelection() || { index: quill.getText().length, length: 0 };
        
        // Process the aiContent to properly format it
        const processedContent = aiContent
          // Remove any "AI Generated" prefix
          .replace(/^AI Generated\s*\n+/, '')
          .replace(/^Brainstormed Ideas\s*\n+/, '')
          // Convert HTML-style strong tags to proper formatting
          .replace(/<strong>(.*?)<\/strong>/g, '$1')
          // Format headers with proper Quill formatting
          .replace(/\*\*(.*?):\*\*/g, '<h2>$1</h2>')
          // Format bullet points
          .replace(/\* /g, '• ')
          // Handle nested bullet points
          .replace(/  \* /g, '  ◦ ')
          // Convert newlines to proper spacing
          .replace(/\n\n+/g, '</p><p>')
          .replace(/\n/g, '<br>');
        
        // Wrap the content in a styled block
        const formattedContent = `
          <div class="ai-content-block">
            <div class="ai-content-body">
              <p>${processedContent}</p>
            </div>
          </div>
        `;
        
        quill.clipboard.dangerouslyPasteHTML(range.index, formattedContent);
        setPreviousAiContent(aiContent);
        quill.focus();
      }
    }
  }, [aiContent, applyAIContent]);

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
    <div className="flex flex-col">
      <div className="flex items-center justify-end bg-card p-2 -mt-10 gap-2 rounded-md shadow-sm">
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
          .ai-content-block {
            background-color: rgba(139, 92, 246, 0.05);
            border-left: 3px solid #8b5cf6;
            padding: 16px;
            margin: 16px 0;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .ai-content-header {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
          }
          .ai-label {
            color: #8b5cf6;
            font-weight: 500;
            font-size: 0.9rem;
            background-color: rgba(139, 92, 246, 0.1);
            padding: 2px 8px;
            border-radius: 4px;
          }
          .ai-content-body {
            color: #1f2937;
            line-height: 1.7;
          }
          .ql-editor {
            min-height: 400px;
            font-size: 16px;
            line-height: 1.7;
            color: #1f2937;
            padding: 16px 20px;
          }
          .ql-toolbar {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background-color: #f8f9fa;
            border-color: #e5e7eb;
            padding: 10px;
            position: fixed;
            top: 136px;
            z-index: 1000;
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
