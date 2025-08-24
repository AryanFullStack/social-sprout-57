import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  Users, 
  PenTool, 
  Calendar, 
  FileText, 
  Clock, 
  Activity, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Zap,
  ChevronDown,
  LogOut,
  User,
  Moon,
  Sun
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";

const navigationItems = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Content",
    items: [
      { title: "Composer", url: "/composer", icon: PenTool },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Templates", url: "/templates", icon: FileText, badge: "Soon" },
      { title: "Queue", url: "/queue", icon: Clock, badge: "3" },
    ]
  },
  {
    title: "Management",
    items: [
      { title: "Accounts", url: "/accounts", icon: Users },
      { title: "Logs", url: "/logs", icon: Activity, badge: "2" },
      { title: "Analytics", url: "/analytics", icon: BarChart3, badge: "New" },
    ]
  },
  {
    title: "Settings",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Help", url: "/help", icon: HelpCircle },
    ]
  }
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = (path: string) => {
    const baseClasses = "w-full justify-start transition-colors";
    return isActive(path) 
      ? `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90` 
      : `${baseClasses} hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out successfully",
          description: "You have been logged out of your account.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
    <Sidebar
      className="w-64"
      collapsible="icon"
    >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-brand bg-clip-text text-transparent">
              Social Sprout
            </span>
          </div>
        </div>

        <SidebarContent className="px-3 py-4">
          {navigationItems.map((section, sectionIndex) => (
            <SidebarGroup key={sectionIndex} className="mb-6">
              <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-2">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={getNavClassName(item.url)}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="ml-3 flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === "New" ? "default" : "secondary"} 
                              className="ml-auto text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-3 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-sidebar-foreground/60">john@example.com</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 mr-2" />
                  ) : (
                    <Moon className="w-4 h-4 mr-2" />
                  )}
                  Toggle {theme === "dark" ? "Light" : "Dark"} Mode
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>

        {/* Sidebar Toggle */}
        <div className="absolute top-4 -right-4 z-50">
          <SidebarTrigger className="bg-background border shadow-md hover:bg-muted" />
        </div>
      </Sidebar>
    </>
  );
}