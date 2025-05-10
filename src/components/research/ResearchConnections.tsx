
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";

// Sample connections data
const connectionTypes = [
  { id: "1", name: "Citation" },
  { id: "2", name: "Collaboration" },
  { id: "3", name: "Same Research Group" },
  { id: "4", name: "Similar Topic" }
];

const sampleResearchers = [
  { id: "1", name: "Dr. Emily Chen", institution: "MIT", field: "Machine Learning", connections: 15 },
  { id: "2", name: "Prof. Robert Johnson", institution: "Stanford", field: "Computer Vision", connections: 23 },
  { id: "3", name: "Dr. Michael Smith", institution: "Berkeley", field: "Natural Language Processing", connections: 19 },
  { id: "4", name: "Prof. Sarah Williams", institution: "Harvard", field: "Reinforcement Learning", connections: 12 },
  { id: "5", name: "Dr. James Wilson", institution: "Carnegie Mellon", field: "Robotics", connections: 18 }
];

const sampleConnections = [
  { from: "1", to: "2", type: "Collaboration", strength: "Strong", papers: 5 },
  { from: "1", to: "3", type: "Citation", strength: "Medium", papers: 3 },
  { from: "2", to: "4", type: "Same Research Group", strength: "Strong", papers: 7 },
  { from: "3", to: "5", type: "Similar Topic", strength: "Weak", papers: 2 },
  { from: "4", to: "5", type: "Collaboration", strength: "Medium", papers: 4 },
  { from: "2", to: "3", type: "Citation", strength: "Strong", papers: 8 }
];

const getResearcherById = (id: string) => {
  return sampleResearchers.find(researcher => researcher.id === id);
};

export function ResearchConnections() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  
  // Filter connections based on type and search
  const filteredConnections = sampleConnections.filter(connection => {
    if (filterType !== "all" && connection.type !== filterType) return false;
    
    const fromResearcher = getResearcherById(connection.from);
    const toResearcher = getResearcherById(connection.to);
    
    if (searchQuery && fromResearcher && toResearcher && 
        !fromResearcher.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !toResearcher.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="grid md:grid-cols-12 gap-6">
      <div className="md:col-span-4 lg:col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Connection Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {connectionTypes.map(type => (
                    <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Search Researchers</Label>
              <Input 
                placeholder="Search by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Connection Strength</Label>
              <RadioGroup defaultValue="all">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strong" id="strong" />
                  <Label htmlFor="strong">Strong</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weak" id="weak" />
                  <Label htmlFor="weak">Weak</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-8 lg:col-span-9">
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-serif">Research Connections</CardTitle>
              <Select defaultValue="visual">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual Map</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="matrix">Matrix View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredConnections.length > 0 ? (
              <div className="space-y-4">
                <div className="relative h-80 border rounded-md overflow-hidden bg-slate-50 p-4">
                  {/* This would be replaced with an actual visualization library in a real app */}
                  <div className="flex items-center justify-center h-full">
                    <div className="relative w-full h-full">
                      {sampleResearchers.map(researcher => (
                        <div 
                          key={researcher.id}
                          className="absolute bg-white p-2 rounded-lg border shadow-sm"
                          style={{
                            left: `${(parseInt(researcher.id) * 18) % 80 + 10}%`,
                            top: `${(parseInt(researcher.id) * 15) % 70 + 10}%`,
                          }}
                        >
                          <p className="font-medium">{researcher.name}</p>
                          <p className="text-xs text-muted-foreground">{researcher.field}</p>
                        </div>
                      ))}
                      
                      {filteredConnections.map((connection, index) => {
                        const fromResearcher = getResearcherById(connection.from);
                        const toResearcher = getResearcherById(connection.to);
                        
                        return (
                          <div 
                            key={`${connection.from}-${connection.to}`}
                            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              width: '100%',
                              height: '100%',
                              zIndex: -1
                            }}
                          >
                            <svg width="100%" height="100%" className="absolute top-0 left-0">
                              <line
                                x1={`${(parseInt(connection.from) * 18) % 80 + 15}%`}
                                y1={`${(parseInt(connection.from) * 15) % 70 + 15}%`}
                                x2={`${(parseInt(connection.to) * 18) % 80 + 15}%`}
                                y2={`${(parseInt(connection.to) * 15) % 70 + 15}%`}
                                stroke={connection.strength === "Strong" ? "#3b82f6" : connection.strength === "Medium" ? "#6366f1" : "#9ca3af"}
                                strokeWidth="2"
                                strokeDasharray={connection.type === "Citation" ? "5,5" : ""}
                                onClick={() => setSelectedConnection(connection)}
                                className="cursor-pointer"
                              />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Connection Details</h4>
                  <div className="space-y-3">
                    {filteredConnections.map(connection => {
                      const fromResearcher = getResearcherById(connection.from);
                      const toResearcher = getResearcherById(connection.to);
                      
                      return (
                        <Card 
                          key={`${connection.from}-${connection.to}`}
                          className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                            selectedConnection === connection ? 'border-primary' : ''
                          }`}
                          onClick={() => setSelectedConnection(connection)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center">
                              <div className="flex-1">
                                <p className="font-medium">{fromResearcher?.name}</p>
                                <p className="text-sm text-muted-foreground">{fromResearcher?.institution}</p>
                              </div>
                              
                              <div className="mx-2 flex flex-col items-center">
                                <Network className="h-5 w-5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{connection.type}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  connection.strength === "Strong" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : connection.strength === "Medium"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {connection.strength}
                                </span>
                              </div>
                              
                              <div className="flex-1 text-right">
                                <p className="font-medium">{toResearcher?.name}</p>
                                <p className="text-sm text-muted-foreground">{toResearcher?.institution}</p>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-xs text-muted-foreground text-center">
                              {connection.papers} joint publications
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Network className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No matching connections found</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
