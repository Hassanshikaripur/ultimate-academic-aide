
import { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RichTextEditorProps {
  initialValue: string;
  onSave: (content: string) => void;
  applyAIContent?: (content: string) => void;
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

  // Effect to handle AI content application only when aiContent changes
  useEffect(() => {
    if (applyAIContent && aiContent && aiContent !== previousAiContent) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        // Get current selection or use the end of the document
        const range = quill.getSelection() || { index: quill.getText().length, length: 0 };
        
        // Format AI content with some styling
        const formattedContent = `\n\n<div class="ai-content-block"><em>AI Generated:</em>\n${aiContent}</div>\n`;
        
        // Insert formatted content
        quill.clipboard.dangerouslyPasteHTML(range.index, formattedContent);
        
        // Update state to track that we've processed this content
        setPreviousAiContent(aiContent);
        
        // Focus back on editor
        quill.focus();
      }
    }
  }, [aiContent, applyAIContent]);

  const handleChange = (value: string) => {
    setContent(value);
    onSave(value);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link", "image",
    "align"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/dashboard")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </div>
      
      <style>
        {`
          .ai-content-block {
            background-color: rgba(96, 165, 250, 0.1);
            border-left: 3px solid #3b82f6;
            padding: 12px;
            margin: 12px 0;
            border-radius: 4px;
          }
          .ai-content-block em {
            color: #3b82f6;
            font-weight: 500;
            display: block;
            margin-bottom: 8px;
          }
          .ql-editor {
            min-height: 350px;
            font-size: 16px;
            line-height: 1.6;
          }
          .ql-toolbar {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            background-color: #f8f9fa;
          }
          .ql-container {
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            font-family: 'Inter', sans-serif;
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
        className="flex-1 rounded-md shadow-sm"
        style={{ height: "calc(100% - 120px)" }}
      />
    </div>
  );
}
