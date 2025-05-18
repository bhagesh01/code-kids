
import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "./AuthContext";
import { User, UserRole } from "./types";
import { authenticateWithSupabase, authenticateWithMockData, signupWithSupabase } from "./authUtils";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change event:", event);
        if (session) {
          const userData = {
            id: session.user.id,
            email: session.user.email as string,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || "",
            role: session.user.user_metadata.role as UserRole || "student",
            profileImage: session.user.user_metadata.profileImage,
          };
          console.log("Setting user from session:", userData);
          setUser(userData);
          localStorage.setItem("codekids_user", JSON.stringify(userData));
        } else {
          console.log("Clearing user data");
          setUser(null);
          localStorage.removeItem("codekids_user");
        }
      }
    );

    // Check for saved user data in localStorage on initial load
    const storedUser = localStorage.getItem("codekids_user");
    if (storedUser) {
      console.log("Found user in localStorage");
      setUser(JSON.parse(storedUser));
    }
    
    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Found session" : "No session");
      if (session) {
        const userData = {
          id: session.user.id,
          email: session.user.email as string,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || "",
          role: session.user.user_metadata.role as UserRole || "student",
          profileImage: session.user.user_metadata.profileImage,
        };
        console.log("Setting user from initial session:", userData);
        setUser(userData);
        localStorage.setItem("codekids_user", JSON.stringify(userData));
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Try Supabase authentication first
      const { userData: supabaseUser, error: supabaseError } = await authenticateWithSupabase(email, password);
      
      if (supabaseError) {
        // Fall back to mock users if Supabase fails
        const { userData: mockUser, error: mockError } = authenticateWithMockData(email, password);
        
        if (mockError) {
          setIsLoading(false);
          toast.error(mockError.message);
          throw mockError;
        }
        
        // Save mock user data
        localStorage.setItem("codekids_user", JSON.stringify(mockUser));
        setUser(mockUser);
        toast.success(`Welcome back, ${mockUser.name}!`);
        console.log("Login successful with mock user:", mockUser);
      } else if (supabaseUser) {
        // Save Supabase user data
        localStorage.setItem("codekids_user", JSON.stringify(supabaseUser));
        setUser(supabaseUser);
        toast.success(`Welcome back, ${supabaseUser.name}!`);
        console.log("Login successful with Supabase user:", supabaseUser);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any, role: UserRole) => {
    setIsLoading(true);
    try {
      const { data, error } = await signupWithSupabase(userData, role);
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Account created! Please check your email to confirm your account.");
        navigate("/login");
        return;
      }
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("codekids_user");
      setUser(null);
      toast.info("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
