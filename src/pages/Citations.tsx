
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CitationManager } from "@/components/citations/CitationManager";
import { Card, CardContent } from "@/components/ui/card";

const Citations = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Citations</h1>
        
        <Card className="glass-card">
          <CardContent className="p-5">
            <CitationManager />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Citations;
