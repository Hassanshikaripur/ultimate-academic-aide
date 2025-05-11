
import { useState, useEffect } from "react";
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
import { Network, Search, Filter, Download, ZoomIn, ZoomOut, Share } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const generateRandomPosition = () => ({
  x: Math.random() * 800 + 100,
  y: Math.random() * 400 + 100,
});

// Sample data
const researchers = [
  { id: "r1", name: "Alan Turing", institution: "University of Cambridge", field: "Computer Science", year: 1950 },
  { id: "r2", name: "Grace Hopper", institution: "Harvard University", field: "Computer Science", year: 1955 },
  { id: "r3", name: "John McCarthy", institution: "Stanford University", field: "Artificial Intelligence", year: 1960 },
  { id: "r4", name: "Ada Lovelace", institution: "University of London", field: "Mathematics", year: 1842 },
  { id: "r5", name: "Claude Shannon", institution: "MIT", field: "Information Theory", year: 1948 },
  { id: "r6", name: "Richard Feynman", institution: "Caltech", field: "Physics", year: 1965 },
  { id: "r7", name: "Marvin Minsky", institution: "MIT", field: "Artificial Intelligence", year: 1970 },
  { id: "r8", name: "Margaret Hamilton", institution: "MIT", field: "Software Engineering", year: 1969 },
];

// Generate nodes for researchers
const initialNodes = researchers.map((researcher) => ({
  id: researcher.id,
  data: { 
    label: researcher.name, 
    institution: researcher.institution,
    field: researcher.field,
    year: researcher.year
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
  { id: "e1-2", source: "r1", target: "r2", animated: true, label: "Collaborated", style: { stroke: '#4f46e5' } },
  { id: "e1-3", source: "r1", target: "r3", label: "Influenced", style: { stroke: '#10b981' } },
  { id: "e2-8", source: "r2", target: "r8", label: "Mentored", style: { stroke: '#f59e0b' } },
  { id: "e3-7", source: "r3", target: "r7", animated: true, label: "Co-authored", style: { stroke: '#4f46e5' } },
  { id: "e4-5", source: "r4", target: "r5", label: "Related Work", style: { stroke: '#8b5cf6' } },
  { id: "e5-6", source: "r5", target: "r6", label: "Cited", style: { stroke: '#ec4899' } },
  { id: "e7-6", source: "r7", target: "r6", label: "Disputed", style: { stroke: '#ef4444' } },
  { id: "e3-5", source: "r3", target: "r5", label: "Built Upon", style: { stroke: '#10b981' } },
];

const topics = [
  "All Fields",
  "Artificial Intelligence",
  "Machine Learning",
  "Computer Science",
  "Information Theory",
  "Mathematics",
  "Physics",
  "Software Engineering"
];

export function ResearchConnections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fieldFilter, setFieldFilter] = useState<string>("All Fields");
  const [yearRange, setYearRange] = useState([1840, 2023]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Load researchers from database if available
  useEffect(() => {
    async function loadResearchers() {
      try {
        setIsLoading(true);
        
        // Check if researchers table exists
        const { data: researchers, error: researchersError } = await supabase
          .from('researchers')
          .select('*');
        
        if (researchersError) throw researchersError;
        
        if (researchers && researchers.length > 0) {
          // Format data from database
          const dbNodes = researchers.map(researcher => ({
            id: researcher.id,
            data: {
              label: researcher.name,
              institution: researcher.institution,
              field: researcher.field,
              year: researcher.year
            },
            position: researcher.position || generateRandomPosition(),
            style: {
              background: '#ffffff',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              width: 150,
            }
          }));
          
          // Get connections
          const { data: connections, error: connectionsError } = await supabase
            .from('researcher_connections')
            .select('*');
            
          if (connectionsError) throw connectionsError;
          
          const dbEdges = connections ? connections.map(connection => ({
            id: connection.id,
            source: connection.source_id,
            target: connection.target_id,
            animated: connection.animated || false,
            label: connection.relationship_type,
            style: { stroke: connection.color || '#4f46e5' }
          })) : [];
          
          // Update state with database data
          setNodes(dbNodes);
          setEdges(dbEdges);
        }
      } catch (error) {
        console.error("Error loading research connections:", error);
        // Using initial data as fallback
      } finally {
        setIsLoading(false);
      }
    }
    
    loadResearchers();
  }, [setNodes, setEdges]);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = searchTerm === "" || 
      node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.data.institution.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesField = fieldFilter === "All Fields" || node.data.field === fieldFilter;
    
    const matchesYear = node.data.year >= yearRange[0] && node.data.year <= yearRange[1];
    
    return matchesSearch && matchesField && matchesYear;
  });

  const filteredNodeIds = filteredNodes.map(node => node.id);
  const filteredEdges = edges.filter(edge => 
    filteredNodeIds.includes(edge.source) && filteredNodeIds.includes(edge.target)
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setFieldFilter("All Fields");
    setYearRange([1840, 2023]);
  };
  
  const handleDownloadGraph = () => {
    const graphData = {
      nodes: filteredNodes,
      edges: filteredEdges
    };
    
    const dataStr = JSON.stringify(graphData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUri;
    downloadLink.download = 'research-connections.json';
    downloadLink.click();
    
    toast({
      description: "Graph data downloaded successfully",
    });
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
              <Select value={fieldFilter} onValueChange={setFieldFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Fields" />
                </SelectTrigger>
                <SelectContent>
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
                  value={yearRange as [number, number]}
                  onValueChange={value => setYearRange(value as [number, number])}
                  min={1840}
                  max={2023}
                  step={1}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end lg:col-span-4 gap-2">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <Filter className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleDownloadGraph}>
                <Download className="h-4 w-4 mr-1" />
                Download Graph
              </Button>
            </div>
          </div>
          
          <div className="h-[500px] border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
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
                <Panel position="top-right" className="bg-white p-2 rounded shadow-sm">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </Panel>
              </ReactFlow>
            )}
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
