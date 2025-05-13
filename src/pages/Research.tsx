
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PaperAnalysis } from "@/components/research/PaperAnalysis";

const Research = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Research</h1>
      <PaperAnalysis />
    </DashboardLayout>
  );
};

export default Research;
