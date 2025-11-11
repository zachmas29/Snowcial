import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase_client";

export type AuthHookType = {
  user: User | null;
  error: string | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthHookType | undefined>(undefined);

export default function useAuth(): AuthHookType {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = useCallback(async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setError(error.message);
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: newUser },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        // Don't show "Auth session missing" as an error - it's expected when not logged in
        if (!error.message.includes("Auth session missing")) {
          setError(error.message);
        }
      } else {
        setUser(newUser);
      }
      setLoading(false);
    };

    getUser();

    // Subscribe to auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      setError(null); // Clear any errors when auth state changes
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, error, loading, signIn, signOut };
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within a AuthContext.Provider",
    );
  }
  return context;
}
