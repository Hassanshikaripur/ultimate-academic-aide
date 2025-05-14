
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card p-4">
      <div className="bg-card border border-border/40 rounded-lg shadow-xl max-w-md w-full p-8 text-center glass-card">
        <h1 className="text-8xl font-extrabold text-primary mb-4">
          404
        </h1>
        <div className="bg-primary/20 text-primary px-3 py-1 text-sm rounded rotate-12 inline-block mb-6">
          Page Not Found
        </div>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild size="lg" className="w-full">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
