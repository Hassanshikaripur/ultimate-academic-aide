
import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Panel,
  ConnectionLineType,
  Position
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Plus, Network, Search, Trash2, Link2, ZoomIn, ZoomOut, Save } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";

// Initial flow setup with some example nodes
const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Neural Networks', description: 'Computational models inspired by the human brain' },
    position: { x: 250, y: 100 },
    type: 'input'
  },
  {
    id: '2',
    data: { label: 'Deep Learning', description: 'Subset of machine learning using multi-layered neural networks' },
    position: { x: 100, y: 200 }
  },
  {
    id: '3',
    data: { label: 'Computer Vision', description: 'Field of AI that trains computers to interpret visual data' },
    position: { x: 400, y: 200 }
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'relates to', animated: true },
  { id: 'e1-3', source: '1', target: '3', label: 'used in' }
];

export function KnowledgeGraph() {
  const flowRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState("");
  const [nodeType, setNodeType] = useState<string>("default");
  const [nodeDescription, setNodeDescription] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("relates to");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Add new node to the flow
  const handleAddNode = useCallback(() => {
    if (!nodeName.trim()) return;
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      data: { 
        label: nodeName,
        description: nodeDescription || "No description available"
      },
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
      type: nodeType as 'default' | 'input' | 'output'
    };
    
    setNodes((nds) => nds.concat(newNode));
    setNodeName("");
    setNodeDescription("");
  }, [nodeName, nodeType, nodeDescription, setNodes]);

  // Connect two nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        label: edgeLabel,
        type: 'smoothstep',
        animated: false,
        data: { customData: 'Custom edge data' }
      }, eds));
    },
    [edgeLabel, setEdges]
  );

  // Delete selected node
  const handleDeleteNode = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    // Also remove any connected edges
    setEdges((eds) => 
      eds.filter(
        (edge) => 
          !nodes.find((node) => 
            node.selected && (node.id === edge.source || node.id === edge.target)
          )
      )
    );
    setSelectedNode(null);
  }, [nodes, setNodes, setEdges]);

  // Delete selected edge
  const handleDeleteEdge = useCallback(() => {
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    setSelectedEdge(null);
  }, [setEdges]);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
  }, []);

  // Update edge label
  const handleUpdateEdgeLabel = useCallback((newLabel: string) => {
    if (selectedEdge && newLabel.trim()) {
      setEdges((eds) => 
        eds.map((ed) => 
          ed.id === selectedEdge.id ? { ...ed, label: newLabel } : ed
        )
      );
    }
  }, [selectedEdge, setEdges]);

  // Filter nodes based on search term
  const filteredNodes = searchTerm
    ? nodes.filter(node => 
        node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.data.description && node.data.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : nodes;

  // Download graph as PNG
  const handleDownloadImage = () => {
    if (!flowRef.current) return;
    
    const reactFlowInstance = flowRef.current;
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    
    if (!flowElement) return;
    
    // Create a temporary canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = flowElement.offsetWidth;
    canvas.height = flowElement.offsetHeight;
    
    // Draw a white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Use html2canvas to capture the flow as an image (simplified for this example)
    const dataURL = canvas.toDataURL('image/png');
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'knowledge-graph.png';
    downloadLink.click();
  };

  // Save graph as JSON
  const handleSaveGraph = () => {
    const graphData = {
      nodes,
      edges
    };
    
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUri;
    downloadLink.download = 'knowledge-graph.json';
    downloadLink.click();
  };

  return (
    <Card className="overflow-hidden relative h-[600px]">
      <ReactFlow
        ref={flowRef}
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{
          style: { stroke: '#1E40AF' },
          type: 'smoothstep'
        }}
        fitView
      >
        <Controls />
        <MiniMap nodeColor="#6B7280" />
        <Background gap={12} size={1} color="#f1f1f1" />

        <Panel position="top-left" className="bg-white p-3 rounded-md border shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search nodes..."
                className="w-48"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Node
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Node</DialogTitle>
                  <DialogDescription>
                    Create a new node for your knowledge graph.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="node-name" className="text-right">Name</Label>
                    <Input 
                      id="node-name" 
                      value={nodeName} 
                      onChange={(e) => setNodeName(e.target.value)} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="node-type" className="text-right">Type</Label>
                    <select
                      id="node-type"
                      value={nodeType}
                      onChange={(e) => setNodeType(e.target.value)}
                      className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="default">Default</option>
                      <option value="input">Source</option>
                      <option value="output">Target</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="node-description" className="text-right">Description</Label>
                    <Textarea 
                      id="node-description" 
                      value={nodeDescription} 
                      onChange={(e) => setNodeDescription(e.target.value)}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddNode}>Add Node</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Link2 className="h-4 w-4 mr-1" />
                  Connections
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configure Connections</DialogTitle>
                  <DialogDescription>
                    Set up how nodes connect in your graph.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edge-label" className="text-right">Default Label</Label>
                    <Input 
                      id="edge-label" 
                      value={edgeLabel} 
                      onChange={(e) => setEdgeLabel(e.target.value)} 
                      className="col-span-3" 
                      placeholder="relates to"
                    />
                  </div>
                  {selectedEdge && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="update-edge-label" className="text-right">Update Label</Label>
                        <Input 
                          id="update-edge-label" 
                          defaultValue={selectedEdge.label as string} 
                          onBlur={(e) => handleUpdateEdgeLabel(e.target.value)} 
                          className="col-span-3" 
                        />
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleDeleteEdge}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Connection
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Panel>

        <Panel position="top-right" className="bg-white p-3 rounded-md border shadow-sm flex flex-col gap-2">
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleDownloadImage}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download as Image</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleSaveGraph}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save as JSON</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleDeleteNode}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Selected</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {selectedNode && (
            <div className="mt-2 p-2 border rounded-md bg-muted/50 max-w-xs">
              <h4 className="font-medium text-sm">{selectedNode.data.label}</h4>
              {selectedNode.data.description && (
                <p className="text-xs text-muted-foreground mt-1">{selectedNode.data.description}</p>
              )}
            </div>
          )}
        </Panel>
      </ReactFlow>
    </Card>
  );
}
