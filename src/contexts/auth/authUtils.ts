
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserRole, MOCK_USERS } from "./types";

export const authenticateWithSupabase = async (email: string, password: string) => {
  console.log("Attempting Supabase login with:", email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error);
      if (error.message.includes("Email not confirmed")) {
        const message = "Please confirm your email before logging in.";
        toast.error(message);
        throw new Error(message);
      }
      if (error.message.includes("Invalid login credentials")) {
        const message = "Invalid email or password";
        toast.error(message);
        throw new Error(message);
      }
      throw new Error(error.message);
    }

    if (data.user) {
      // Fetch the user's profile from our profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching user profile:", profileError);
        // Fallback to user metadata if profile doesn't exist
        const userData = {
          id: data.user.id,
          email: data.user.email as string,
          name: data.user.user_metadata.name || data.user.email?.split('@')[0] || "",
          role: data.user.user_metadata.role as UserRole || "student",
          profileImage: data.user.user_metadata.profileImage,
        };
        return { userData, error: null };
      }

      if (profile) {
        const userData = {
          id: profile.id,
          email: data.user.email as string,
          name: profile.name,
          role: profile.role as UserRole,
          profileImage: profile.profile_image,
        };
        
        return { userData, error: null };
      }
    }
    
    return { error: new Error("Unknown authentication error") };
  } catch (error: any) {
    console.error("Supabase authentication error:", error);
    return { error };
  }
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
  const redirectUrl = `${window.location.origin}/dashboard`;
  
  // Common signup options for metadata
  let options = {
    emailRedirectTo: redirectUrl,
    data: {
      name: "",
      role: role,
    } as any
  };

  // Update options based on role
  if (role === "student") {
    options.data.name = userData.fullName;
    options.data.schoolName = userData.schoolName || "";
    options.data.skills = userData.skills || [];
  } else if (role === "recruiter") {
    options.data.name = userData.name;
    options.data.phoneNumber = userData.phoneNumber || "";
    options.data.linkedInProfile = userData.linkedInProfile || "";
    options.data.organizationName = userData.organizationName || "";
  } else if (role === "admin") {
    options.data.name = userData.name;
  }

  console.log("Creating user with data:", options.data);

  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options
  });
  
  if (error) {
    console.error("Signup error:", error);
    throw error;
  }
  
  console.log("Signup successful:", data);
  return { data, error };
};
