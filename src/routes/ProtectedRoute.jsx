import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient'; // Ensure this path matches your client file

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check current session on mount
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes (like logout or token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {/* You can use a component from your 'animation' folder here */}
        <p>Loading session...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;