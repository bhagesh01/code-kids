
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

// Mock user data for demonstration
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
    // Check for saved user data in localStorage on initial load
    const storedUser = localStorage.getItem("codekids_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
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
      // In a real app, this would be an API call
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === userData.email)) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const newUser = {
        id: `user${MOCK_USERS.length + 1}`,
        email: userData.email,
        name: userData.fullName || userData.name || userData.email.split('@')[0],
        role: role,
        profileImage: "https://i.pravatar.cc/300?img=5",
      };

      // Save to localStorage
      localStorage.setItem("codekids_user", JSON.stringify(newUser));
      setUser(newUser);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("codekids_user");
    setUser(null);
    toast.info("Logged out successfully");
    navigate("/login");
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
