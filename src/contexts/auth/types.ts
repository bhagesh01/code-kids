
export type UserRole = "student" | "recruiter" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Mock user data for demonstration - will be used only if Supabase auth fails
export const MOCK_USERS = [
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
    id: "admin",
    email: "admin@example.com",
    password: "password123",
    name: "Admin User",
    role: "admin" as UserRole,
    profileImage: "https://i.pravatar.cc/300?img=3",
  },
  {
    id: "testuser",
    email: "justforfunuse01@gmail.com",
    password: "bobby@1234",
    name: "Bobby Test",
    role: "student" as UserRole,
    profileImage: "https://i.pravatar.cc/300?img=4",
  },
];
