
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CitationManager } from "@/components/citations/CitationManager";
import { Card, CardContent } from "@/components/ui/card";

const Citations = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Citations</h1>
        
        <Card>
          <CardContent className="p-5">
            <CitationManager />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Citations;
