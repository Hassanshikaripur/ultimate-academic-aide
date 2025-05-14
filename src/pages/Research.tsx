
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PaperAnalysis } from "@/components/research/PaperAnalysis";
import { Card, CardContent } from "@/components/ui/card";

const Research = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Research</h1>
        
        <Card>
          <CardContent className="p-5">
            <PaperAnalysis />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Research;
