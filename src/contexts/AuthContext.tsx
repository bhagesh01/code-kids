
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "student" | "recruiter" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data for demonstration - will be used only if Supabase auth fails
const MOCK_USERS = [
  {
    id: "user1",
    email: "student@example.com",
    password: "password123",
    name: "John Doe",
    role: "student" as UserRole,
    profileImage: "https://i.pravatar.cc/300",
  },
  {
    id: "user2",
    email: "recruiter@example.com",
    password: "password123",
    name: "Jane Smith",
    role: "recruiter" as UserRole,
    profileImage: "https://i.pravatar.cc/300?img=2",
  },
  {
    id: "user3",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "admin" as UserRole,
    profileImage: "https://i.pravatar.cc/300?img=3",
  },
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const userData = {
            id: session.user.id,
            email: session.user.email as string,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || "",
            role: session.user.user_metadata.role as UserRole || "student",
            profileImage: session.user.user_metadata.profileImage,
          };
          setUser(userData);
          localStorage.setItem("codekids_user", JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem("codekids_user");
        }
      }
    );

    // Check for saved user data in localStorage on initial load
    const storedUser = localStorage.getItem("codekids_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData = {
          id: session.user.id,
          email: session.user.email as string,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || "",
          role: session.user.user_metadata.role as UserRole || "student",
          profileImage: session.user.user_metadata.profileImage,
        };
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
      // Try to login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback to mock users for development
        const foundUser = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (!foundUser) {
          throw new Error("Invalid email or password");
        }

        const userData = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          profileImage: foundUser.profileImage,
        };

        // Save to localStorage
        localStorage.setItem("codekids_user", JSON.stringify(userData));
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
      } else if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email as string,
          name: data.user.user_metadata.name || data.user.email?.split('@')[0] || "",
          role: data.user.user_metadata.role as UserRole || "student",
          profileImage: data.user.user_metadata.profileImage,
        };
        
        // Save to localStorage
        localStorage.setItem("codekids_user", JSON.stringify(userData));
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any, role: UserRole) => {
    setIsLoading(true);
    try {
      // For student role
      if (role === "student") {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.fullName,
              role: role,
              schoolName: userData.schoolName,
              skills: userData.skills || [],
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          const newUser = {
            id: data.user.id,
            email: data.user.email as string,
            name: userData.fullName,
            role: role,
            profileImage: "https://i.pravatar.cc/300?img=5", // Default avatar
          };
          
          // Save to localStorage
          localStorage.setItem("codekids_user", JSON.stringify(newUser));
          setUser(newUser);
          toast.success("Account created successfully!");
          navigate("/dashboard");
        }
      }
      // For recruiter role
      else if (role === "recruiter") {
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              role: role,
              phoneNumber: userData.phoneNumber,
              linkedInProfile: userData.linkedInProfile,
              organizationName: userData.organizationName,
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          const newUser = {
            id: data.user.id,
            email: data.user.email as string,
            name: userData.name,
            role: role,
            profileImage: "https://i.pravatar.cc/300?img=2", // Default avatar
          };
          
          // Save to localStorage
          localStorage.setItem("codekids_user", JSON.stringify(newUser));
          setUser(newUser);
          toast.success("Account created successfully!");
          navigate("/dashboard");
        }
      }
      // For admin role - in a real app this would need special verification
      else if (role === "admin") {
        // Check admin code (in real app, this would be more secure)
        if (userData.adminCode !== "admin123") {
          throw new Error("Invalid admin code");
        }
        
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              role: role,
              adminVerified: true,
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          const newUser = {
            id: data.user.id,
            email: data.user.email as string,
            name: data.user.email.split('@')[0],
            role: role,
            profileImage: "https://i.pravatar.cc/300?img=3", // Default avatar
          };
          
          // Save to localStorage
          localStorage.setItem("codekids_user", JSON.stringify(newUser));
          setUser(newUser);
          toast.success("Admin account created successfully!");
          navigate("/dashboard");
        }
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
