
import { useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        setError(error.message || "Invalid credentials");
        toast({
          title: "Error",
          description: error.message || "Invalid credentials",
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.user || !data.session) {
        setError("Error retrieving user data");
        return false;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to AnimeIT!"
      });
      
      return true;
    } catch (error: any) {
      console.error("Login exception:", error);
      setError(error.message || "An error occurred during login");
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .limit(1);
      
      if (checkError) {
        console.error("Username check error:", checkError);
      } else if (existingUsers && existingUsers.length > 0) {
        setError("Username already taken");
        toast({
          title: "Error",
          description: "Username already taken. Choose another username.",
          variant: "destructive"
        });
        return false;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        setError(error.message || "Registration failed");
        toast({
          title: "Error",
          description: error.message || "Registration failed",
          variant: "destructive"
        });
        return false;
      }
      
      if (!data.user) {
        setError("Error creating user");
        return false;
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: data.user.id, username, created_at: new Date().toISOString() }
        ]);
      
      if (profileError) {
        console.error("Profile creation error:", profileError.message);
        setError(profileError.message || "Error creating profile");
        await supabase.auth.admin.deleteUser(data.user.id);
        toast({
          title: "Error",
          description: "Error creating profile",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Registration successful",
        description: "We've sent you an email to confirm your account. Confirm your account to sign in."
      });
      
      return true;
    } catch (error: any) {
      console.error("Registration exception:", error);
      setError(error.message || "An error occurred during registration");
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error.message);
        setError(error.message || "Error during logout");
        toast({
          title: "Error",
          description: error.message || "Unable to logout",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully"
      });
      return true;
    } catch (error: any) {
      console.error("Logout exception:", error);
      setError(error.message || "An error occurred during logout");
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login,
    register,
    logout
  };
};
