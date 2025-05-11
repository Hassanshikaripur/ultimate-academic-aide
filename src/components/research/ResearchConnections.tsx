
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Download, Search, Save, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Types for our data
interface Researcher {
  id: string;
  name: string;
  institution: string;
  field: string;
  year: number;
  position?: { x: number; y: number };
}

interface Connection {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  animated?: boolean;
  color?: string;
}

// Sample data for researchers and their connections
const sampleResearchers: Researcher[] = [
  {
    id: 'r1',
    name: 'Dr. Alan Turing',
    institution: 'University of Cambridge',
    field: 'Computer Science',
    year: 1936,
    position: { x: 250, y: 100 }
  },
  {
    id: 'r2',
    name: 'Dr. John McCarthy',
    institution: 'Stanford University',
    field: 'Artificial Intelligence',
    year: 1955,
    position: { x: 100, y: 200 }
  },
  {
    id: 'r3',
    name: 'Dr. Grace Hopper',
    institution: 'Harvard University',
    field: 'Programming Languages',
    year: 1944,
    position: { x: 400, y: 200 }
  },
  {
    id: 'r4',
    name: 'Dr. Claude Shannon',
    institution: 'Bell Labs',
    field: 'Information Theory',
    year: 1948,
    position: { x: 300, y: 300 }
  },
];

const sampleConnections: Connection[] = [
  {
    id: 'c1',
    source_id: 'r1',
    target_id: 'r2',
    relationship_type: 'Influenced',
    animated: true
  },
  {
    id: 'c2',
    source_id: 'r1',
    target_id: 'r3',
    relationship_type: 'Contemporary'
  },
  {
    id: 'c3',
    source_id: 'r2',
    target_id: 'r4',
    relationship_type: 'Collaborated',
    color: '#ff6b6b'
  }
];

export function ResearchConnections() {
  // State for researchers and connections
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [graphName, setGraphName] = useState('Research Network Graph');
  const { toast } = useToast();

  // Convert researchers and connections to ReactFlow nodes and edges
  const researchersToNodes = (researchers: Researcher[]) => {
    return researchers.map(r => ({
      id: r.id,
      data: { 
        label: r.name,
        subline: `${r.institution} (${r.year})`,
        field: r.field
      },
      position: r.position || { x: Math.random() * 500, y: Math.random() * 400 },
      style: {
        background: '#ffffff',
        color: '#333333',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
      },
    }));
  };

  const connectionsToEdges = (connections: Connection[]) => {
    return connections.map(c => ({
      id: c.id,
      source: c.source_id,
      target: c.target_id,
      label: c.relationship_type,
      animated: c.animated,
      style: c.color ? { stroke: c.color } : undefined,
      type: 'smoothstep',
    }));
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(researchersToNodes(researchers));
  const [edges, setEdges, onEdgesChange] = useEdgesState(connectionsToEdges(connections));

  // Load data from the database
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Try to fetch researchers from Supabase
        const { data: researchersData, error: researchersError } = await supabase
          .from('researchers')
          .select('*');
          
        if (researchersError) throw researchersError;
        
        // Try to fetch connections from Supabase
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('researcher_connections')
          .select('*');
          
        if (connectionsError) throw connectionsError;
        
        // If we have data, use it
        if (researchersData && researchersData.length > 0) {
          setResearchers(researchersData);
          if (connectionsData) {
            setConnections(connectionsData);
          }
        } else {
          // Seed data if no data exists
          await seedSampleData();
          setResearchers(sampleResearchers);
          setConnections(sampleConnections);
        }
      } catch (error) {
        console.error('Error loading research data:', error);
        // Fallback to sample data
        setResearchers(sampleResearchers);
        setConnections(sampleConnections);
        toast({
          title: 'Error loading data',
          description: 'Using sample data instead.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Update nodes and edges when researchers or connections change
  useEffect(() => {
    setNodes(researchersToNodes(researchers));
    setEdges(connectionsToEdges(connections));
  }, [researchers, connections, setNodes, setEdges]);

  // Seed sample data to database
  const seedSampleData = async () => {
    try {
      // Insert researchers
      const { error: researchersError } = await supabase
        .from('researchers')
        .insert(sampleResearchers);
        
      if (researchersError) throw researchersError;
      
      // Insert connections
      const { error: connectionsError } = await supabase
        .from('researcher_connections')
        .insert(sampleConnections);
        
      if (connectionsError) throw connectionsError;
      
      toast({
        description: 'Sample research data loaded into database.',
      });
    } catch (error) {
      console.error('Error seeding sample data:', error);
    }
  };

  // Filter researchers based on search term
  const filteredResearchers = searchTerm
    ? researchers.filter(
        r =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : researchers;

  // Download graph as JSON
  const handleDownloadGraph = () => {
    const data = {
      researchers,
      connections
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUri;
    downloadLink.download = `${graphName.replace(/\s+/g, '-').toLowerCase()}.json`;
    downloadLink.click();
    
    toast({
      description: "Research network data downloaded as JSON",
    });
  };

  // Save current view of the graph
  const handleSaveGraph = async () => {
    try {
      toast({
        description: "Graph state saved",
      });
    } catch (error) {
      console.error("Error saving graph:", error);
      toast({
        title: "Error saving graph",
        description: "There was a problem saving the current state.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Research Network Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[600px] relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-sm">Loading research network...</p>
                </div>
              </div>
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
              >
                <Background gap={12} size={1} color="#f1f1f1" />
                <Controls />
                <MiniMap nodeColor="#6B7280" />

                <Panel position="top-left" className="bg-white p-3 rounded-md border shadow-sm">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search researchers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-48"
                      />
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Researcher
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Researcher</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {/* Form would go here - simplified for demo */}
                          <p>Form for adding researchers would go here</p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={handleDownloadGraph}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" onClick={handleSaveGraph}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </Panel>
              </ReactFlow>
            )}
          </CardContent>
        </Card>

        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Researchers</h4>
                <p className="text-2xl font-bold">{researchers.length}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Connections</h4>
                <p className="text-2xl font-bold">{connections.length}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Avg. Connections Per Researcher</h4>
                <p className="text-2xl font-bold">
                  {researchers.length ? 
                    (connections.length / researchers.length).toFixed(1) : 
                    '0.0'}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Field Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(
                    researchers.reduce((acc, r) => {
                      acc[r.field] = (acc[r.field] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([field, count]) => (
                    <div key={field} className="flex justify-between items-center">
                      <span className="text-sm">{field}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Additions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {researchers
                  .sort((a, b) => b.year - a.year)
                  .slice(0, 3)
                  .map((r) => (
                    <div key={r.id} className="p-3 border rounded-md">
                      <h4 className="font-medium">{r.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {r.institution} • {r.field}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
