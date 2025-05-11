
import { useCallback, useRef, useState, useEffect } from "react";
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
  Position,
  useReactFlow
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Plus, Network, Search, Trash2, Link2, ZoomIn, ZoomOut, Save, UploadCloud, Share2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type NodeData = {
  label: string;
  description: string;
};

// Initial flow setup with some example nodes
const initialNodes: Node<NodeData>[] = [
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
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState("");
  const [nodeType, setNodeType] = useState<string>("default");
  const [nodeDescription, setNodeDescription] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("relates to");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [graphName, setGraphName] = useState("Research Knowledge Graph");
  const [edgeType, setEdgeType] = useState<string>("smoothstep");
  const { toast } = useToast();

  // Load graph from the database
  useEffect(() => {
    const loadGraph = async () => {
      try {
        setIsLoading(true);
        
        // Try to load nodes from the database
        const { data: researchersData, error: researchersError } = await supabase
          .from('researchers')
          .select('*');
          
        if (researchersError) throw researchersError;
        
        // Try to load edges from the database
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('researcher_connections')
          .select('*');
          
        if (connectionsError) throw connectionsError;
        
        // If we have data, convert it to nodes and edges
        if (researchersData && researchersData.length > 0) {
          const dbNodes = researchersData.map((researcher) => ({
            id: researcher.id,
            data: { 
              label: researcher.name, 
              description: `${researcher.institution} - ${researcher.field}` 
            },
            position: researcher.position || { 
              x: Math.random() * 500, 
              y: Math.random() * 500 
            },
            type: 'default'
          }));
          
          const dbEdges = connectionsData ? connectionsData.map((connection) => ({
            id: connection.id,
            source: connection.source_id,
            target: connection.target_id,
            label: connection.relationship_type,
            animated: connection.animated,
            style: connection.color ? { stroke: connection.color } : undefined,
            type: 'smoothstep'
          })) : [];
          
          if (dbNodes.length > 0) {
            setNodes(dbNodes);
            if (dbEdges.length > 0) {
              setEdges(dbEdges);
            }
          }
        }
        
      } catch (error) {
        console.error("Error loading graph from database:", error);
        toast({
          title: "Failed to load graph",
          description: "Using sample data instead.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGraph();
  }, [setNodes, setEdges, toast]);

  // Add new node to the flow
  const handleAddNode = useCallback(() => {
    if (!nodeName.trim()) return;
    
    const newNode: Node<NodeData> = {
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
    
    // Save the new node to the database
    saveNodeToDatabase(newNode);
  }, [nodeName, nodeType, nodeDescription, setNodes]);

  // Save node to database
  const saveNodeToDatabase = async (node: Node<NodeData>) => {
    try {
      const { error } = await supabase
        .from('researchers')
        .insert({
          id: node.id,
          name: node.data.label,
          institution: "Unknown",
          field: node.data.description,
          year: new Date().getFullYear(),
          position: node.position
        });
        
      if (error) throw error;
      
      toast({
        description: "Node saved to database",
      });
    } catch (error) {
      console.error("Error saving node:", error);
      toast({
        title: "Failed to save node",
        description: "The node was added to the graph but not saved to the database.",
        variant: "destructive"
      });
    }
  };

  // Connect two nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      
      const newEdge = {
        ...connection,
        id: `e${connection.source}-${connection.target}-${Date.now()}`,
        label: edgeLabel,
        type: edgeType as 'default' | 'smoothstep' | 'step' | 'straight',
        animated: false
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      // Save the new edge to the database
      saveEdgeToDatabase(newEdge);
    },
    [edgeLabel, edgeType, setEdges]
  );
  
  // Save edge to database
  const saveEdgeToDatabase = async (edge: any) => {
    try {
      const { error } = await supabase
        .from('researcher_connections')
        .insert({
          id: edge.id,
          source_id: edge.source,
          target_id: edge.target,
          relationship_type: edge.label,
          animated: edge.animated || false
        });
        
      if (error) throw error;
      
      toast({
        description: "Connection saved to database",
      });
    } catch (error) {
      console.error("Error saving edge:", error);
      toast({
        title: "Failed to save connection",
        description: "The connection was added to the graph but not saved to the database.",
        variant: "destructive"
      });
    }
  };

  // Delete selected node
  const handleDeleteNode = useCallback(() => {
    const nodesToDelete = nodes.filter((node) => node.selected);
    
    if (nodesToDelete.length === 0) {
      toast({
        title: "No node selected",
        description: "Please select a node to delete.",
        variant: "destructive"
      });
      return;
    }
    
    // Delete nodes from database
    nodesToDelete.forEach(async (node) => {
      try {
        const { error } = await supabase
          .from('researchers')
          .delete()
          .eq('id', node.id);
          
        if (error) throw error;
      } catch (error) {
        console.error(`Error deleting node ${node.id}:`, error);
      }
    });
    
    setNodes((nds) => nds.filter((node) => !node.selected));
    
    // Also remove any connected edges
    setEdges((eds) => 
      eds.filter(
        (edge) => 
          !nodesToDelete.some((node) => 
            node.id === edge.source || node.id === edge.target
          )
      )
    );
    
    setSelectedNode(null);
    
    toast({
      description: `${nodesToDelete.length} node(s) deleted`,
    });
  }, [nodes, setNodes, setEdges, toast]);

  // Delete selected edge
  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdge) {
      toast({
        title: "No connection selected",
        description: "Please select a connection to delete.",
        variant: "destructive"
      });
      return;
    }
    
    // Delete edge from database
    try {
      supabase
        .from('researcher_connections')
        .delete()
        .eq('id', selectedEdge.id)
        .then(({ error }) => {
          if (error) throw error;
          
          setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
          setSelectedEdge(null);
          
          toast({
            description: "Connection deleted",
          });
        });
    } catch (error) {
      console.error(`Error deleting edge ${selectedEdge.id}:`, error);
      toast({
        title: "Failed to delete connection",
        description: "There was an error deleting the connection from the database.",
        variant: "destructive"
      });
    }
  }, [selectedEdge, setEdges, toast]);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
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
      
      // Update edge in database
      try {
        supabase
          .from('researcher_connections')
          .update({ relationship_type: newLabel })
          .eq('id', selectedEdge.id)
          .then(({ error }) => {
            if (error) throw error;
            
            toast({
              description: "Connection label updated",
            });
          });
      } catch (error) {
        console.error(`Error updating edge ${selectedEdge.id}:`, error);
      }
    }
  }, [selectedEdge, setEdges, toast]);

  // Filter nodes based on search term
  const filteredNodes = searchTerm
    ? nodes.filter(node => {
        const nodeLabel = node.data?.label || "";
        const nodeDesc = node.data?.description || "";
        
        return nodeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                nodeDesc.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : nodes;

  // Download graph as PNG
  const handleDownloadImage = () => {
    if (!flowRef.current) return;
    
    // Create a temporary canvas to draw the graph
    const flowElement = document.querySelector('.react-flow') as HTMLElement;
    if (!flowElement) return;
    
    // Use html2canvas or similar to capture the flow (simplified for demo)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = flowElement.offsetWidth * 2;
    canvas.height = flowElement.offsetHeight * 2;
    ctx.scale(2, 2); // Higher resolution
    
    // Draw a white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw the flow (in a real implementation, you'd use html2canvas or a similar library)
    // This is just a placeholder
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Knowledge Graph', 20, 40);
    
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = '#1E40AF';
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.fillText(node.data.label.substring(0, 2), node.position.x - 10, node.position.y + 5);
    });
    
    // Draw edges (simplified)
    edges.forEach(edge => {
      if (edge.source && edge.target) {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.position.x, sourceNode.position.y);
          ctx.lineTo(targetNode.position.x, targetNode.position.y);
          ctx.strokeStyle = '#1E40AF';
          ctx.stroke();
        }
      }
    });
    
    // Create a download link
    const link = document.createElement('a');
    link.download = `${graphName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast({
      description: "Knowledge graph downloaded as an image",
    });
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
    downloadLink.download = `${graphName.replace(/\s+/g, '-').toLowerCase()}.json`;
    downloadLink.click();
    
    toast({
      description: "Knowledge graph saved as JSON file",
    });
  };
  
  // Import graph from JSON
  const handleImportGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.nodes && json.edges) {
          setNodes(json.nodes);
          setEdges(json.edges);
          toast({
            description: "Graph imported successfully",
          });
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        toast({
          title: "Import failed",
          description: "Could not parse the JSON file. Make sure it's a valid graph export.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };
  
  // Handle zoom in/out
  const handleZoomIn = () => {
    reactFlowInstance?.zoomIn();
  };
  
  const handleZoomOut = () => {
    reactFlowInstance?.zoomOut();
  };

  return (
    <Card className="overflow-hidden relative h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm">Loading knowledge graph...</p>
          </div>
        </div>
      )}
      
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
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edge-type" className="text-right">Edge Type</Label>
                    <Select value={edgeType} onValueChange={setEdgeType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select edge type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smoothstep">Smooth Step</SelectItem>
                        <SelectItem value="step">Step</SelectItem>
                        <SelectItem value="straight">Straight</SelectItem>
                      </SelectContent>
                    </Select>
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
            
            {/* Import/Export options */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <UploadCloud className="h-4 w-4 mr-1" />
                  Import/Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import/Export Graph</DialogTitle>
                  <DialogDescription>
                    Save your graph or load a previously saved one.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="graph-name" className="text-right">Graph Name</Label>
                    <Input 
                      id="graph-name" 
                      value={graphName} 
                      onChange={(e) => setGraphName(e.target.value)} 
                      className="col-span-3" 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 justify-end">
                      <Button onClick={handleSaveGraph} variant="outline" className="w-full">
                        <Save className="h-4 w-4 mr-1" />
                        Save as JSON
                      </Button>
                      <Button onClick={handleDownloadImage} variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-1" />
                        Download as Image
                      </Button>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <Label htmlFor="import-file">Import from file</Label>
                    <Input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={handleImportGraph}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Panel>

        <Panel position="top-right" className="bg-white p-3 rounded-md border shadow-sm flex flex-col gap-2">
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
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
