import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const OAuth2Callback: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = React.useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        login(token, user);
        toast.success('Successfully logged in with Google!');
        navigate('/');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    } else {
      toast.error('Authentication failed. No token received.');
      navigate('/login');
    }
  }, [location, login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xl serif-italic text-ink/50">Completing authentication...</p>
      </div>
    </div>
  );
};
