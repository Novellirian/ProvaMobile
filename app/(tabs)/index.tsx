import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabase';

export default function Index() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        router.replace('/home'); // Redireciona para a tela de boas-vindas
      }
       else {
        router.replace('/LoginScreen'); // Redireciona para LoginScreen caso contrário
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isAuthenticated]);

  if (loading) {
    return null; // Mostra um indicador de carregamento, se necessário
  }

  return null;
}
