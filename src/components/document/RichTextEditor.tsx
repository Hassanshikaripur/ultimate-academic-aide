
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

  // Effect to handle AI content application
  useEffect(() => {
    if (applyAIContent && aiContent) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        if (range) {
          quill.insertText(range.index, aiContent);
        } else {
          quill.insertText(quill.getText().length, aiContent);
        }
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
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className="flex-1"
        style={{ height: "calc(100% - 120px)" }}
      />
    </div>
  );
}
