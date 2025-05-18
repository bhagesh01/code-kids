
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserRole, MOCK_USERS } from "./types";

export const authenticateWithSupabase = async (email: string, password: string) => {
  console.log("Attempting login with:", email);
  // Try to login with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase login error:", error);
    // Check if error is due to email not confirmed
    if (error.message.includes("Email not confirmed")) {
      toast.error("Please confirm your email before logging in.");
      throw new Error("Please confirm your email before logging in.");
    }
    return { error };
  } else if (data.user) {
    const userData = {
      id: data.user.id,
      email: data.user.email as string,
      name: data.user.user_metadata.name || data.user.email?.split('@')[0] || "",
      role: data.user.user_metadata.role as UserRole || "student",
      profileImage: data.user.user_metadata.profileImage,
    };
    
    return { userData, error: null };
  }
  return { error: new Error("Unknown authentication error") };
};

export const authenticateWithMockData = (email: string, password: string) => {
  const foundUser = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    return { error: new Error("Invalid email or password") };
  }

  const userData = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role,
    profileImage: foundUser.profileImage,
  };
  
  return { userData, error: null };
};

export const signupWithSupabase = async (userData: any, role: UserRole) => {
  // Common signup options for metadata
  let options = {
    data: {
      name: "",
      role: role,
    }
  };

  // Update options based on role
  if (role === "student") {
    options.data.name = userData.fullName;
    options.data.schoolName = userData.schoolName;
    options.data.skills = userData.skills || [];
  } else if (role === "recruiter") {
    options.data.name = userData.name;
    options.data.phoneNumber = userData.phoneNumber;
    options.data.linkedInProfile = userData.linkedInProfile;
    options.data.organizationName = userData.organizationName;
  } else if (role === "admin") {
    options.data.name = userData.name;
  }

  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options
  });
  
  if (error) throw error;
  
  return { data, error };
};
