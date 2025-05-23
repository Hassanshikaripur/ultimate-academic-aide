import { DocumentSkeleton } from "./DocumentSkeleton";

export function DocumentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-card/80 backdrop-blur-sm p-4 rounded-lg border">
          <DocumentSkeleton />
        </div>
      ))}
    </div>
  );
}