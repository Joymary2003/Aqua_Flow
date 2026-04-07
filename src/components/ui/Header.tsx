import { motion } from "framer-motion";
import { User as UserIcon, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSignIn: () => void;
  onProfile: () => void;
}

const Header = ({ onSignIn, onProfile }: HeaderProps) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 max-w-lg mx-auto px-5 flex items-center justify-between">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md border-b border-border/10" />
      
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
        </div>
        <span className="font-bold text-lg tracking-tight">AquaFlow</span>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        {isAuthenticated ? (
          <button 
            onClick={onProfile}
            className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 active:scale-95 transition-transform"
          >
            <UserIcon size={20} className="text-blue-600" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSignIn}
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              Sign In
            </Button>
            <Button 
              size="sm" 
              onClick={onSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-5 h-9"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
