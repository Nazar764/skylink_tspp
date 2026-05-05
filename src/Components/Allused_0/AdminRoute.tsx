import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

interface AdminRouteProps {
  user: any | null;
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ user, children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('auth_id', user.id)
        .single();

      if (error) {
        console.error('AdminRoute role error:', error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(data?.role === 'admin');
      }

      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  if (loading) {
    return <div className="admin-route-loading">Перевірка доступу...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;