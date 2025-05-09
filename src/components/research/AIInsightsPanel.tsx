
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Zap, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface InsightProps {
  id: string;
  title: string;
  text: string;
  source: string;
  relevance: number;
}

const sampleInsights: InsightProps[] = [
  {
    id: "insight1",
    title: "Connection to Recent Research",
    text: "This section appears to relate strongly to Zhang et al. (2023). Consider adding their findings on transfer learning to strengthen your argument.",
    source: "AI Analysis",
    relevance: 95,
  },
  {
    id: "insight2",
    title: "Missing Citation",
    text: "The methodology described here is similar to Li & Wang (2022). Consider citing their paper for additional support.",
    source: "Citation Analysis",
    relevance: 85,
  },
  {
    id: "insight3",
    title: "Terminology Clarification",
    text: "The use of 'neural architecture' here could be more precise. In recent literature, this typically refers to the specific layers and connections, not the overall approach.",
    source: "Text Analysis",
    relevance: 78,
  },
];

interface AIInsightsPanelProps {
  insights?: InsightProps[];
}

export function AIInsightsPanel({ insights = [] }: AIInsightsPanelProps) {
  const [allInsights, setAllInsights] = useState<InsightProps[]>([
    ...(insights.length > 0 ? insights : sampleInsights)
  ]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  // Update insights when props change
  useEffect(() => {
    if (insights.length > 0) {
      setAllInsights(prevInsights => {
        // Filter out duplicate insights by id
        const existingIds = new Set(prevInsights.map(insight => insight.id));
        const newInsights = insights.filter(insight => !existingIds.has(insight.id));
        return [...newInsights, ...prevInsights];
      });
    }
  }, [insights]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleInsightClick = (id: string) => {
    setActiveInsight(activeInsight === id ? null : id);
  };

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
            <Button variant="ghost" size="icon" onClick={togglePanel}>
              <X size={18} />
            </Button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {allInsights.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Zap size={24} className="mb-2" />
                <p>No insights yet. Use the AI Tools button to generate insights.</p>
              </div>
            ) : (
              allInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-all",
                    activeInsight === insight.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                  onClick={() => handleInsightClick(insight.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {insight.relevance}%
                    </Badge>
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
                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                      <span>{insight.source}</span>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {allInsights.length > 0 && (
            <div className="p-4 border-t">
              <Button className="w-full" variant="outline">
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
