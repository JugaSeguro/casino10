/**
 * Hook personalizado para obtener enlaces por grupo desde landing_phones
 * Específico para 24envivo-wsp (grupo: 24envivo-wsp)
 */

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Grupo específico para este proyecto
const REPOSITORY_GROUP = '24envivo-wsp';

// Enlaces por defecto como fallback
const DEFAULT_LINKS = {
  whatsapp_link: 'https://wa.me/5491123456792',
  register_title: 'Registrate gratis y pedi 2000 fichas para probar'
};

export const useGlobalLinks = () => {
  const [links, setLinks] = useState(DEFAULT_LINKS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener enlaces del grupo desde landing_phones
      const { data, error: supabaseError } = await supabase
        .from('landing_phones')
        .select('whatsapp_link, description, landing_number, is_active, updated_at')
        .eq('repository_group', REPOSITORY_GROUP)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (supabaseError) {
        console.warn('Error al obtener enlaces desde Supabase:', supabaseError.message);
        console.log('Usando enlaces por defecto para grupo:', REPOSITORY_GROUP);
        setLinks(DEFAULT_LINKS);
      } else if (data && data.length > 0) {
        const linkData = data[0];
        console.log('Enlaces obtenidos desde Supabase para grupo', REPOSITORY_GROUP, ':', linkData);
        setLinks({
          whatsapp_link: linkData.whatsapp_link || DEFAULT_LINKS.whatsapp_link,
          register_title: DEFAULT_LINKS.register_title
        });
        
        // Obtener información adicional del grupo
        const { data: groupData } = await supabase
          .from('landing_phones_by_group')
          .select('*')
          .eq('repository_group', REPOSITORY_GROUP)
          .single();
          
        if (groupData) {
          setGroupInfo(groupData);
        }
      } else {
        console.log('No se encontraron enlaces activos para el grupo:', REPOSITORY_GROUP);
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

    // Suscribirse a cambios en tiempo real para el grupo específico
    const subscription = supabase
      .channel(`landing_phones_changes_${REPOSITORY_GROUP}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'landing_phones',
          filter: `repository_group=eq.${REPOSITORY_GROUP}`
        },
        (payload) => {
          console.log('Enlaces actualizados en tiempo real para grupo', REPOSITORY_GROUP, ':', payload);
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
    groupInfo,
    refetch: fetchLinks
  };
};

export default useGlobalLinks;