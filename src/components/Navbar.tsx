
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Code, Home, User, LogOut, Menu } from "lucide-react";
import { useAuth } from '@/contexts/auth';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar = ({ isLoggedIn: isLoggedInProp }: NavbarProps = {}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [credits, setCredits] = useState(5);

  // Use the auth context for the isAuthenticated state, but allow prop override for special cases
  const isLoggedIn = isLoggedInProp !== undefined ? isLoggedInProp : isAuthenticated;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-10 w-full">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2 animate-fade-in">
          <Code className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">CodeKids</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center mr-4 px-3 py-1 bg-secondary rounded-full text-sm font-medium animate-fade-in">
                <span className="mr-1">Credits:</span>
                <span className="font-bold">{credits}</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full w-10 h-10 p-0 hover-scale">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-scale-in">
                  <Link to="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex space-x-2 animate-fade-in">
              <Link to="/login">
                <Button variant="outline" className="hover-scale">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="hover-scale">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
