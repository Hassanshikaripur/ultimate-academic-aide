
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import Research from "./pages/Research";
import Citations from "./pages/Citations";
import Document from "./pages/Document";
import Settings from "./pages/Settings";
import Share from "./pages/Share";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<Index />} />
            <Route path="/research" element={<Research />} />
            <Route path="/citations" element={<Citations />} />
            <Route path="/document/:id" element={<Document />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/share" element={<Share />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
