
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
      async (event, session) => {
        console.log("Auth state change event:", event, session?.user?.id);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            try {
              // Fetch user profile from profiles table
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error && error.code !== 'PGRST116') {
                console.error("Error fetching profile:", error);
                // Fallback to session user metadata
                const userData = {
                  id: session.user.id,
                  email: session.user.email as string,
                  name: session.user.user_metadata.name || session.user.email?.split('@')[0] || "",
                  role: session.user.user_metadata.role as UserRole || "student",
                  profileImage: session.user.user_metadata.profileImage,
                };
                setUser(userData);
                localStorage.setItem("codekids_user", JSON.stringify(userData));
              } else if (profile) {
                const userData = {
                  id: profile.id,
                  email: session.user.email as string,
                  name: profile.name,
                  role: profile.role as UserRole,
                  profileImage: profile.profile_image,
                };
                console.log("Setting user from profile:", userData);
                setUser(userData);
                localStorage.setItem("codekids_user", JSON.stringify(userData));
              }
            } catch (error) {
              console.error("Error in auth state change:", error);
            }
          }, 0);
        } else {
          console.log("Clearing user data");
          setUser(null);
          localStorage.removeItem("codekids_user");
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log("Initial session found:", session.user.id);
          
          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching initial profile:", profileError);
            // Fallback to session user metadata
            const userData = {
              id: session.user.id,
              email: session.user.email as string,
              name: session.user.user_metadata.name || session.user.email?.split('@')[0] || "",
              role: session.user.user_metadata.role as UserRole || "student",
              profileImage: session.user.user_metadata.profileImage,
            };
            setUser(userData);
            localStorage.setItem("codekids_user", JSON.stringify(userData));
          } else if (profile) {
            const userData = {
              id: profile.id,
              email: session.user.email as string,
              name: profile.name,
              role: profile.role as UserRole,
              profileImage: profile.profile_image,
            };
            console.log("Setting user from initial profile:", userData);
            setUser(userData);
            localStorage.setItem("codekids_user", JSON.stringify(userData));
          }
        } else {
          console.log("No initial session found");
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", email);
      
      // Try Supabase authentication first
      const { userData: supabaseUser, error: supabaseError } = await authenticateWithSupabase(email, password);
      
      if (supabaseError) {
        // Fall back to mock users if Supabase fails
        console.log("Supabase login failed, trying mock users");
        const { userData: mockUser, error: mockError } = authenticateWithMockData(email, password);
        
        if (mockError) {
          setIsLoading(false);
          throw mockError;
        }
        
        // Save mock user data
        localStorage.setItem("codekids_user", JSON.stringify(mockUser));
        setUser(mockUser);
        toast.success(`Welcome back, ${mockUser.name}!`);
        console.log("Login successful with mock user:", mockUser);
      } else if (supabaseUser) {
        // Supabase auth successful - user data will be set by onAuthStateChange
        toast.success(`Welcome back, ${supabaseUser.name}!`);
        console.log("Login successful with Supabase user:", supabaseUser);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw error;
    } finally {
      // Only set loading to false if not using Supabase (which will be handled by onAuthStateChange)
      if (!supabase) {
        setIsLoading(false);
      }
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error logging out:", error);
        toast.error("Error logging out");
        return;
      }
      
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
