
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Maximize, Filter } from "lucide-react";

// Mock data for the knowledge graph
const graphData = {
  nodes: [
    { id: "1", label: "Neural Networks", group: 1, size: 25 },
    { id: "2", label: "Computer Vision", group: 1, size: 20 },
    { id: "3", label: "Convolutional Networks", group: 1, size: 15 },
    { id: "4", label: "Image Classification", group: 1, size: 15 },
    { id: "5", label: "Machine Learning", group: 2, size: 25 },
    { id: "6", label: "Deep Learning", group: 2, size: 20 },
    { id: "7", label: "Transfer Learning", group: 2, size: 15 },
    { id: "8", label: "Feature Extraction", group: 3, size: 15 },
    { id: "9", label: "Dataset Analysis", group: 3, size: 18 },
    { id: "10", label: "Research Methods", group: 4, size: 22 },
    { id: "11", label: "Experimentation", group: 4, size: 17 },
    { id: "12", label: "Evaluation Metrics", group: 4, size: 16 },
  ],
  edges: [
    { source: "1", target: "2", value: 8 },
    { source: "1", target: "3", value: 10 },
    { source: "2", target: "4", value: 6 },
    { source: "5", target: "6", value: 12 },
    { source: "5", target: "7", value: 7 },
    { source: "6", target: "1", value: 9 },
    { source: "7", target: "3", value: 5 },
    { source: "8", target: "9", value: 7 },
    { source: "8", target: "4", value: 5 },
    { source: "9", target: "12", value: 6 },
    { source: "10", target: "11", value: 8 },
    { source: "11", target: "12", value: 7 },
    { source: "10", target: "5", value: 4 },
    { source: "6", target: "7", value: 8 },
    { source: "3", target: "4", value: 9 },
  ],
};

export function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulated graph rendering function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawGraph = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.01)";
      ctx.fillRect(0, 0, width, height);

      // Set scale based on zoom
      ctx.save();
      ctx.scale(zoom, zoom);
      ctx.translate(width / (2 * zoom) - width / 2, height / (2 * zoom) - height / 2);

      // Draw edges first
      ctx.strokeStyle = "rgba(203, 213, 225, 0.4)";
      ctx.lineWidth = 1;

      graphData.edges.forEach(edge => {
        const sourceNode = graphData.nodes.find(node => node.id === edge.source);
        const targetNode = graphData.nodes.find(node => node.id === edge.target);
        
        if (sourceNode && targetNode) {
          // Calculate positions (simplified for this example)
          const sourceX = (parseInt(sourceNode.id) * 50) % width;
          const sourceY = (parseInt(sourceNode.id) * 85) % height;
          
          const targetX = (parseInt(targetNode.id) * 60) % width;
          const targetY = (parseInt(targetNode.id) * 75) % height;
          
          ctx.beginPath();
          ctx.moveTo(sourceX, sourceY);
          ctx.lineTo(targetX, targetY);
          ctx.stroke();
        }
      });

      // Draw nodes
      graphData.nodes.forEach(node => {
        const x = (parseInt(node.id) * 50) % width;
        const y = (parseInt(node.id) * 85) % height;
        const radius = node.size / 2;
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        
        // Color based on group
        switch(node.group) {
          case 1:
            ctx.fillStyle = "rgba(37, 99, 235, 0.7)";
            break;
          case 2:
            ctx.fillStyle = "rgba(134, 25, 143, 0.7)";
            break;
          case 3:
            ctx.fillStyle = "rgba(16, 185, 129, 0.7)";
            break;
          case 4:
            ctx.fillStyle = "rgba(245, 158, 11, 0.7)";
            break;
          default:
            ctx.fillStyle = "rgba(100, 116, 139, 0.7)";
        }
        
        ctx.fill();
        
        // Draw label
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.font = "10px Inter";
        ctx.textAlign = "center";
        ctx.fillText(node.label, x, y + radius + 12);
      });

      ctx.restore();
    };

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawGraph();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [zoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`relative flex flex-col border rounded-lg overflow-hidden 
        ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-[500px]'}`}
    >
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-serif font-medium">Knowledge Graph</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            <span className="text-xs">Filter</span>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative flex-grow overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Slider
            value={[zoom]}
            min={0.5}
            max={3}
            step={0.1}
            onValueChange={(vals) => setZoom(vals[0])}
            className="w-32"
          />
          
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
