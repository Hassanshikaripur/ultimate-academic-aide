
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, Maximize, Filter, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Initial data for the knowledge graph
const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Neural Networks' },
    position: { x: 250, y: 100 },
    style: { backgroundColor: 'rgba(37, 99, 235, 0.1)', borderColor: 'rgba(37, 99, 235, 0.8)' }
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Computer Vision' },
    position: { x: 100, y: 200 },
    style: { backgroundColor: 'rgba(37, 99, 235, 0.1)', borderColor: 'rgba(37, 99, 235, 0.8)' }
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'Machine Learning' },
    position: { x: 400, y: 200 },
    style: { backgroundColor: 'rgba(134, 25, 143, 0.1)', borderColor: 'rgba(134, 25, 143, 0.8)' }
  },
  {
    id: '4',
    type: 'default',
    data: { label: 'Deep Learning' },
    position: { x: 400, y: 350 },
    style: { backgroundColor: 'rgba(134, 25, 143, 0.1)', borderColor: 'rgba(134, 25, 143, 0.8)' }
  },
  {
    id: '5',
    type: 'default',
    data: { label: 'Image Classification' },
    position: { x: 150, y: 350 },
    style: { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.8)' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e4-5', source: '4', target: '5', animated: true },
];

export function KnowledgeGraph() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  }, [setEdges]);

  const addNode = useCallback(() => {
    const id = (nodes.length + 1).toString();
    const newNode = {
      id,
      type: 'default',
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        label: `New Topic ${id}`,
      },
      style: { 
        backgroundColor: 'rgba(245, 158, 11, 0.1)', 
        borderColor: 'rgba(245, 158, 11, 0.8)' 
      }
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`relative flex flex-col border rounded-lg overflow-hidden 
        ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-[600px]'}`}
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
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="top-right"
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background />
          <Controls />
          <MiniMap />
          
          <Panel position="top-left" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
            <Button onClick={addNode} className="flex items-center gap-1" size="sm">
              <Plus className="h-4 w-4" /> Add Topic
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
