
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Download, BookOpen } from "lucide-react";

export interface PaperSummaryProps {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
  summary: string;
  keyFindings: string[];
  methodologies: string[];
  relevanceScore: number;
  fileUrl?: string;
}

export function PaperSummary({
  id,
  title,
  authors,
  journal,
  year,
  doi,
  abstract,
  summary,
  keyFindings,
  methodologies,
  relevanceScore,
  fileUrl,
}: PaperSummaryProps) {
  // Calculate color based on relevance score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 50) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1">
              {authors.join(", ")} • {journal} ({year})
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className={`rounded-md px-2 py-1 text-sm font-medium ${getScoreColor(relevanceScore)}`}>
              {relevanceScore}% Relevant
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="abstract">Abstract</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4 space-y-4">
            <p className="text-sm">{summary}</p>
            <div>
              <h4 className="text-sm font-medium mb-2">Key Findings</h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {keyFindings.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="abstract" className="mt-4">
            <p className="text-sm">{abstract}</p>
          </TabsContent>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Methodologies</h4>
                <div className="flex flex-wrap gap-2">
                  {methodologies.map((method, index) => (
                    <Badge key={index} variant="outline">{method}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Publication Info</h4>
                <p className="text-sm">
                  <strong>Journal:</strong> {journal}<br />
                  <strong>Year:</strong> {year}<br />
                  {doi && (
                    <>
                      <strong>DOI:</strong> {doi}
                    </>
                  )}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <BookOpen className="mr-2 h-4 w-4" />
          Add to Reading List
        </Button>
        <div className="flex gap-2">
          {fileUrl && (
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
          {doi && (
            <Button size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Source
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
