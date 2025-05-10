
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Network, Search, Filter } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const generateRandomPosition = () => ({
  x: Math.random() * 800 + 100,
  y: Math.random() * 400 + 100,
});

// Sample data
const researchers = [
  { id: "r1", name: "Alan Turing", institution: "University of Cambridge", field: "Computer Science" },
  { id: "r2", name: "Grace Hopper", institution: "Harvard University", field: "Computer Science" },
  { id: "r3", name: "John McCarthy", institution: "Stanford University", field: "Artificial Intelligence" },
  { id: "r4", name: "Ada Lovelace", institution: "University of London", field: "Mathematics" },
  { id: "r5", name: "Claude Shannon", institution: "MIT", field: "Information Theory" },
  { id: "r6", name: "Richard Feynman", institution: "Caltech", field: "Physics" },
  { id: "r7", name: "Marvin Minsky", institution: "MIT", field: "Artificial Intelligence" },
  { id: "r8", name: "Margaret Hamilton", institution: "MIT", field: "Software Engineering" },
];

const topics = [
  "Artificial Intelligence",
  "Machine Learning",
  "Computer Science",
  "Information Theory",
  "Mathematics",
  "Physics",
  "Software Engineering"
];

// Generate nodes for researchers
const initialNodes = researchers.map((researcher) => ({
  id: researcher.id,
  data: { 
    label: researcher.name, 
    institution: researcher.institution,
    field: researcher.field 
  },
  position: generateRandomPosition(),
  style: {
    background: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    width: 150,
  }
}));

// Generate connections between researchers based on field
const initialEdges = [
  { id: "e1-2", source: "r1", target: "r2", animated: true, label: "Collaborated" },
  { id: "e1-3", source: "r1", target: "r3", label: "Influenced" },
  { id: "e2-8", source: "r2", target: "r8", label: "Mentored" },
  { id: "e3-7", source: "r3", target: "r7", animated: true, label: "Co-authored" },
  { id: "e4-5", source: "r4", target: "r5", label: "Related Work" },
  { id: "e5-6", source: "r5", target: "r6", label: "Cited" },
  { id: "e7-6", source: "r7", target: "r6", label: "Disputed" },
  { id: "e3-5", source: "r3", target: "r5", label: "Built Upon" },
];

export function ResearchConnections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldFilter, setFieldFilter] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState([1950, 2023]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = searchTerm === "" || 
      node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.data.institution.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesField = !fieldFilter || node.data.field === fieldFilter;
    
    return matchesSearch && matchesField;
  });

  const filteredNodeIds = filteredNodes.map(node => node.id);
  const filteredEdges = edges.filter(edge => 
    filteredNodeIds.includes(edge.source) && filteredNodeIds.includes(edge.target)
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setFieldFilter(null);
    setYearRange([1950, 2023]);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Research Connection Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Researcher or institution..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Field</label>
              <Select value={fieldFilter || ""} onValueChange={setFieldFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Fields" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Fields</SelectItem>
                  {topics.map(topic => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Publication Period</label>
              <div className="px-2">
                <Slider
                  defaultValue={[1950, 2023]}
                  value={yearRange}
                  onValueChange={setYearRange as any}
                  min={1950}
                  max={2023}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end lg:col-span-4">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <Filter className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            </div>
          </div>
          
          <div className="h-[500px] border rounded-lg overflow-hidden">
            <ReactFlow
              nodes={filteredNodes}
              edges={filteredEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Total Researchers</div>
                  <div className="text-2xl">{filteredNodes.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Connections</div>
                  <div className="text-2xl">{filteredEdges.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Fields Represented</div>
                  <div className="text-2xl">
                    {new Set(filteredNodes.map(node => node.data.field)).size}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
