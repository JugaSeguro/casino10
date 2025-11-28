/**
 * Hook personalizado para obtener enlaces globales desde Supabase
 * Usado por todas las webs para mantener enlaces sincronizados
 */

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Enlaces por defecto como fallback
const DEFAULT_LINKS = {
  whatsapp_link: 'https://wa.link/9l7tig',
  register_title: 'Registrate gratis y pedi 2000 fichas para probar'
};

export const useGlobalLinks = () => {
  const [links, setLinks] = useState(DEFAULT_LINKS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar obtener enlaces desde Supabase
      const { data, error: supabaseError } = await supabase
        .from('global_link')
        .select('whatsapp_link, register_title, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (supabaseError) {
        console.warn('Error al obtener enlaces desde Supabase:', supabaseError.message);
        console.log('Usando enlaces por defecto');
        setLinks(DEFAULT_LINKS);
      } else if (data) {
        console.log('Enlaces obtenidos desde Supabase:', data);
        setLinks({
          whatsapp_link: data.whatsapp_link || DEFAULT_LINKS.whatsapp_link,
          register_title: data.register_title || DEFAULT_LINKS.register_title
        });
      } else {
        console.log('No se encontraron enlaces, usando por defecto');
        setLinks(DEFAULT_LINKS);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError(err.message);
      setLinks(DEFAULT_LINKS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('global_link_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'global_link'
        },
        (payload) => {
          console.log('Enlaces actualizados en tiempo real:', payload);
          fetchLinks();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    links,
    loading,
    error,
    refetch: fetchLinks
  };
};

export default useGlobalLinks;
