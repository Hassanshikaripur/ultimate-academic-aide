
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
import { Plus, Network } from "lucide-react";
import "@xyflow/react/dist/style.css";

// Initial flow setup with some example nodes
const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Neural Networks' },
    position: { x: 250, y: 100 },
    type: 'input'
  },
  {
    id: '2',
    data: { label: 'Deep Learning' },
    position: { x: 100, y: 200 }
  },
  {
    id: '3',
    data: { label: 'Computer Vision' },
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

  // Add new node to the flow
  const handleAddNode = useCallback(() => {
    if (!nodeName.trim()) return;
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      data: { label: nodeName },
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
      type: nodeType as 'default' | 'input' | 'output'
    };
    
    setNodes((nds) => nds.concat(newNode));
    setNodeName("");
  }, [nodeName, nodeType, setNodes]);

  // Connect two nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        label: 'relates to',
        type: 'smoothstep',
        animated: false
      }, eds));
    },
    [setEdges]
  );

  // Delete node
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
  }, [nodes, setNodes, setEdges]);

  return (
    <Card className="overflow-hidden relative h-[600px]">
      <ReactFlow
        ref={flowRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
            <h3 className="text-sm font-medium mb-1">Add Node</h3>
            <div className="flex gap-2">
              <Input 
                value={nodeName} 
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Node name"
                className="w-48"
              />
              <select
                value={nodeType}
                onChange={(e) => setNodeType(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="default">Default</option>
                <option value="input">Source</option>
                <option value="output">Target</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleAddNode}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </Panel>

        <Panel position="top-right" className="bg-white p-3 rounded-md border shadow-sm">
          <Button variant="outline" size="sm" onClick={handleDeleteNode}>
            Delete Selected
          </Button>
        </Panel>
      </ReactFlow>
    </Card>
  );
}
