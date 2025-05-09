
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function AppHeader() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [showSearch, setShowSearch] = useState(false);

  // Update page title based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setPageTitle("Documents");
    else if (path === "/research") setPageTitle("Research");
    else if (path === "/citations") setPageTitle("Citations");
    else if (path === "/settings") setPageTitle("Settings");
    else if (path === "/share") setPageTitle("Share");
    else setPageTitle("ResearchMind");
  }, [location]);

  return (
    <header className="bg-background sticky top-0 z-30 w-full border-b transition-all">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="hidden md:block">
          <h1 className="text-2xl font-serif">{pageTitle}</h1>
        </div>
        
        <div className="md:hidden">
          <h1 className="text-xl font-serif">ResearchMind</h1>
        </div>

        <div className="flex items-center gap-2">
          {!showSearch ? (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    <DropdownMenuItem className="py-2">
                      <div>
                        <div className="font-medium">AI Analysis Complete</div>
                        <div className="text-xs text-muted-foreground">Your paper summaries are ready to view</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2">
                      <div>
                        <div className="font-medium">Citation Alert</div>
                        <div className="text-xs text-muted-foreground">New citation style formats available</div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search for documents, citations..."
                className="w-[260px] focus:w-[300px] transition-all duration-300"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
