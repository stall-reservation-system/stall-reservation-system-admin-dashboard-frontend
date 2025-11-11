import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Map, 
  List, 
  Users,
  LogOut,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

// Mock admin profile data
interface AdminProfile {
  name: string;
  avatar: string;
}
const adminProfile: AdminProfile = {
  name: "Nuwan Perera",
  avatar: "https://ui-avatars.com/api/?name=Nuwan+Perera&background=0D8ABC&color=fff",
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Map, label: "Stall Map", path: "/stall-map" },
    { icon: Users, label: "Vendors", path: "/vendors" },
    { icon: List, label: "Reservations", path: "/reservations" },
    // Removed Admin Profile from sidebar
  ];

  // Sidebar should be sticky, not scroll with main content
  // Profile section is clickable and routes to /profile
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border relative flex flex-col"
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sidebar-foreground font-bold text-md">CMB Bookfair</h1>
              <p className="text-sidebar-foreground/70 text-xs">Admin Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
                    isActive && "bg-sidebar-accent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Admin profile display above logout */}
        <div className="w-64 p-4 border-t border-sidebar-border flex items-center justify-between">
          <Link 
            to="/profile" 
            className="flex items-center gap-3 hover:bg-sidebar-accent rounded-md px-2 py-1 transition"
            style={{ textDecoration: "none", flex: 1, minWidth: 0 }}
          >
            <img
              src={adminProfile.avatar}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full"
            />
            <div className="truncate">
              <div className="text-sidebar-foreground font-semibold leading-tight truncate">
                {adminProfile.name}
              </div>
              <div className="text-xs text-sidebar-foreground/70">
                Account settings
              </div>
            </div>
          </Link>
          <Button
            variant="ghost"
            className="justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent px-2 py-1 ml-2"
            onClick={handleLogout}
            size="sm"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;