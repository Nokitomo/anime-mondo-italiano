
import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export type SessionState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
};

export const useSession = () => {
  const [state, setState] = useState<SessionState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setTimeout(async () => {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', session.user.id)
                .single();

              if (profileError && profileError.code !== 'PGRST116') {
                console.error("Error retrieving profile:", profileError);
              }

              setState({
                user: {
                  ...session.user,
                  username: profileData?.username,
                  avatar_url: profileData?.avatar_url
                },
                session,
                loading: false,
                error: null
              });
            } catch (error) {
              console.error("Error retrieving profile:", error);
              setState(prev => ({ ...prev, loading: false }));
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          setState({
            user: null,
            session: null,
            loading: false,
            error: null
          });
        }
      }
    );

    const checkUser = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (data.session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', data.session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error retrieving profile:", profileError);
          }

          setState({
            user: {
              ...data.session.user,
              username: profileData?.username,
              avatar_url: profileData?.avatar_url
            },
            session: data.session,
            loading: false,
            error: null
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: "Error checking authentication."
        }));
      }
    };

    checkUser();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return state;
};
