import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  PieChart, 
  Target, 
  Upload, 
  Settings, 
  LogOut,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Insights", href: "/insights", icon: Lightbulb },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Trends", href: "/trends", icon: TrendingUp },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] border-r border-[#333] flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#333]">
        <img 
          src="/logo.svg" 
          alt="Cashly Logo" 
          className="w-8 h-8"
        />
        <span className="text-[#f5f5f5] font-bold text-lg">Cashly</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full justify-start gap-3 h-12 ${
                isActive 
                  ? "bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00cc6a]" 
                  : "text-[#ccc] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]"
              }`}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#333]">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-[#00ff88] text-[#0a0a0a]">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#f5f5f5] truncate">
              {user?.name || "Student"}
            </p>
            <p className="text-xs text-[#888] truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-[#ccc] hover:text-[#f5f5f5] hover:bg-[#1a1a1a]"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-[#ff0080] hover:text-[#ff0080] hover:bg-[#1a1a1a]"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
