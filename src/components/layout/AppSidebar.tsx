
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useSidebar } from "@/components/ui/sidebar";

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
  const { state, setOpen } = useSidebar();
  const collapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sync the sidebar state with our local state
  useEffect(() => {
    if (!isMobile) {
      setOpen(state === "expanded");
    }
  }, [state, isMobile, setOpen]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (isMobile) {
      document.body.style.overflow = !sidebarOpen ? "hidden" : "auto";
    }
  };

  const toggleCollapsed = () => {
    setOpen(!collapsed);
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

  const handleNewDocument = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a document",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: "Untitled Document",
          content: "",
          user_id: user.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      navigate(`/document/${data.id}`);
      
      if (isMobile) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: "Failed to create a new document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Mobile menu button - fixed position outside the sidebar */}
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
      <aside 
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
                <span className="text-xl font-serif font-bold text-primary">Nexora</span>
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden md:flex",
                collapsed && "mx-auto"
              )}
              onClick={toggleCollapsed}
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </Button>
          </div>

          {/* Nav links */}
          <div className="flex-grow overflow-y-auto py-4 no-scrollbar">
            <ul className="space-y-2 px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href === "/dashboard" && location.pathname === "/");
                  
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center p-2 rounded-lg hover:bg-accent group transition-all",
                        isActive && "bg-accent",
                        collapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      <item.icon size={20} className={cn(
                        "text-muted-foreground",
                        isActive && "text-foreground"
                      )} />
                      {!collapsed && (
                        <span className={cn(
                          "ml-3 text-sm font-medium",
                          isActive && "font-semibold"
                        )}>
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* New document button */}
          <div className="p-4 border-t">
            <Button 
              className={cn(
                "w-full",
                collapsed && "px-0"
              )}
              onClick={handleNewDocument}
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
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
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
      </aside>
      
      {/* This is the gap element that pushes content when sidebar is expanded */}
      <div 
        className={cn(
          "hidden md:block flex-none transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      />
    </>
  );
}

export default AppSidebar;
