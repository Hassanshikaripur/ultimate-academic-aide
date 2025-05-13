
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CitationManager } from "@/components/citations/CitationManager";

const Citations = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Citations</h1>
      <CitationManager />
    </DashboardLayout>
  );
};

export default Citations;
