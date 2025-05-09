
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  File,
  Search,
  Database,
  Settings,
  Share,
  Menu,
  X,
  Plus,
  User,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const navigation: NavigationItem[] = [
  { name: "Documents", href: "/dashboard", icon: File },
  { name: "Research", href: "/research", icon: Search },
  { name: "Citations", href: "/citations", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Share", href: "/share", icon: Share },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (isMobile) {
      document.body.style.overflow = !sidebarOpen ? "hidden" : "auto";
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-card border-r transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            {!collapsed && (
              <Link to="/dashboard" className="flex items-center">
                <span className="text-xl font-serif font-bold text-primary">ScholarScribe</span>
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden md:flex",
                collapsed && "mx-auto"
              )}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </Button>
          </div>

          {/* Nav links */}
          <div className="flex-grow overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center p-2 rounded-lg hover:bg-accent group transition-all",
                      collapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <item.icon size={20} className="text-muted-foreground" />
                    {!collapsed && (
                      <span className="ml-3 text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* New document button */}
          <div className="p-4 border-t">
            <Button 
              className={cn(
                "w-full",
                collapsed && "px-0"
              )}
              onClick={() => navigate('/document/new')}
            >
              <Plus size={16} className={cn(collapsed ? "mr-0" : "mr-2")} />
              {!collapsed && "New Document"}
            </Button>
          </div>

          {/* User profile and logout */}
          <div className="p-4 border-t">
            <div className={cn("flex", collapsed ? "justify-center" : "justify-between items-center")}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-research-600 flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                </div>
                {!collapsed && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">CS Student</p>
                    <p className="text-xs text-muted-foreground">Final Year</p>
                  </div>
                )}
              </div>
              
              {!collapsed && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleLogout}
                  title="Log out"
                >
                  <LogOut size={18} />
                </Button>
              )}
            </div>
            
            {/* Show logout button when collapsed */}
            {collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="mx-auto mt-4"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AppSidebar;
