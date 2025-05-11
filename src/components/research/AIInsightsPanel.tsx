
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Zap, X, Download, Copy, Check, Pin, Star, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export interface InsightProps {
  id: string;
  title: string;
  text: string;
  source: string;
  relevance: number;
}

interface AIInsightsPanelProps {
  insights?: InsightProps[];
  onClearInsights?: () => void;
  onApplyInsight?: (insight: InsightProps) => void;
}

export function AIInsightsPanel({ 
  insights = [], 
  onClearInsights,
  onApplyInsight
}: AIInsightsPanelProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [starredInsights, setStarredInsights] = useState<string[]>([]);
  const [filterStarred, setFilterStarred] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleInsightClick = (id: string) => {
    setActiveInsight(activeInsight === id ? null : id);
  };

  const handleCopyInsight = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (starredInsights.includes(id)) {
      setStarredInsights(starredInsights.filter(i => i !== id));
    } else {
      setStarredInsights([...starredInsights, id]);
    }
  };

  const toggleFilterStarred = () => {
    setFilterStarred(!filterStarred);
  };

  const filteredInsights = insights.filter(insight => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by starred status if filter is active
    const matchesStarred = !filterStarred || starredInsights.includes(insight.id);
    
    return matchesSearch && matchesStarred;
  });

  return (
    <div
      className={cn(
        "fixed right-0 top-16 bg-card border-l h-[calc(100vh-4rem)] transition-all duration-300 z-20",
        isPanelOpen ? "w-80" : "w-12"
      )}
    >
      {isPanelOpen ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-serif font-medium flex items-center gap-2">
              <Zap size={18} className="text-research-600" />
              AI Insights
            </h3>
            <Button variant="ghost" size="icon" onClick={togglePanel} className="h-8 w-8">
              <X size={16} />
            </Button>
          </div>

          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Input
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-8 w-8", filterStarred && "text-amber-500 bg-amber-50")}
                onClick={toggleFilterStarred}
              >
                <Star size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {insights.length > 0 && (
                <Badge variant="outline" className="text-xs flex gap-1 items-center">
                  <Filter className="h-3 w-3" /> {filteredInsights.length} of {insights.length}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-3 space-y-3">
            {filteredInsights.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                <Zap size={24} className="mb-2" />
                <p className="mb-1">No insights yet</p>
                <p className="text-xs">Use the AI Tools button to generate insights based on your document.</p>
              </div>
            ) : (
              filteredInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-all",
                    activeInsight === insight.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => handleInsightClick(insight.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(insight.id, e);
                        }}
                      >
                        <Star 
                          size={14} 
                          className={cn(
                            "transition-colors", 
                            starredInsights.includes(insight.id) 
                              ? "fill-amber-400 text-amber-400" 
                              : "text-muted-foreground"
                          )} 
                        />
                      </Button>
                      <Badge variant="outline" className="text-xs">
                        {insight.relevance}%
                      </Badge>
                    </div>
                  </div>

                  <p
                    className={cn(
                      "text-sm text-muted-foreground mt-2 transition-all",
                      activeInsight === insight.id
                        ? "line-clamp-none"
                        : "line-clamp-2"
                    )}
                  >
                    {insight.text}
                  </p>

                  {activeInsight === insight.id && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <span className="text-muted-foreground">{insight.source}</span>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyInsight(insight.id, insight.text);
                            }}
                          >
                            {copied === insight.id ? (
                              <><Check className="h-3 w-3 mr-1" /> Copied</>
                            ) : (
                              <><Copy className="h-3 w-3 mr-1" /> Copy</>
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 px-2 text-xs text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onApplyInsight && insight) {
                                onApplyInsight(insight);
                              }
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {insights.length > 0 && (
            <div className="p-3 border-t">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={onClearInsights}
              >
                Clear All Insights
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="ghost"
          className="h-full w-full rounded-none flex flex-col gap-1"
          onClick={togglePanel}
        >
          <Zap size={18} />
          <span className="text-xs rotate-90">Insights</span>
        </Button>
      )}
    </div>
  );
}
