/**
 * Hook personalizado para obtener enlaces por grupo desde landing_phones
 * Reemplaza useGlobalLinks para usar la nueva estructura por grupos
 */

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Enlaces por defecto por grupo como fallback
const DEFAULT_LINKS_BY_GROUP = {
  '1xclub-casinos': {
    whatsapp_link: 'https://wa.link/9l7tig',
    register_title: 'Registrate gratis y pedi 2000 fichas para probar'
  },
  '1xclub-wsp': {
    whatsapp_link: 'https://wa.link/9l7tig',
    register_title: 'Registrate gratis y pedi 2000 fichas para probar'
  },
  '24envivo-casinos': {
    whatsapp_link: 'https://wa.link/9l7tig',
    register_title: 'Registrate gratis y pedi 2000 fichas para probar'
  },
  '24envivo-wsp': {
    whatsapp_link: 'https://wa.link/9l7tig',
    register_title: 'Registrate gratis y pedi 2000 fichas para probar'
  }
};

export const useLandingLinks = (repositoryGroup) => {
  const [links, setLinks] = useState(DEFAULT_LINKS_BY_GROUP[repositoryGroup] || DEFAULT_LINKS_BY_GROUP['1xclub-casinos']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!repositoryGroup) {
        console.warn('No se especificó repositoryGroup, usando enlaces por defecto');
        setLinks(DEFAULT_LINKS_BY_GROUP['1xclub-casinos']);
        setLoading(false);
        return;
      }

      // Obtener enlaces del grupo desde landing_phones
      const { data, error: supabaseError } = await supabase
        .from('landing_phones')
        .select('whatsapp_link, description, landing_number, is_active, updated_at')
        .eq('repository_group', repositoryGroup)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (supabaseError) {
        console.warn('Error al obtener enlaces desde Supabase:', supabaseError.message);
        console.log('Usando enlaces por defecto para grupo:', repositoryGroup);
        setLinks(DEFAULT_LINKS_BY_GROUP[repositoryGroup] || DEFAULT_LINKS_BY_GROUP['1xclub-casinos']);
      } else if (data && data.length > 0) {
        const linkData = data[0];
        console.log('Enlaces obtenidos desde Supabase para grupo', repositoryGroup, ':', linkData);
        
        setLinks({
          whatsapp_link: linkData.whatsapp_link || DEFAULT_LINKS_BY_GROUP[repositoryGroup]?.whatsapp_link,
          register_title: DEFAULT_LINKS_BY_GROUP[repositoryGroup]?.register_title || 'Registrate gratis y pedi 2000 fichas para probar'
        });
        
        // Obtener información adicional del grupo
        const { data: groupData } = await supabase
          .from('landing_phones_by_group')
          .select('*')
          .eq('repository_group', repositoryGroup)
          .single();
          
        if (groupData) {
          setGroupInfo(groupData);
        }
      } else {
        console.log('No se encontraron enlaces activos para el grupo:', repositoryGroup);
        setLinks(DEFAULT_LINKS_BY_GROUP[repositoryGroup] || DEFAULT_LINKS_BY_GROUP['1xclub-casinos']);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError(err.message);
      setLinks(DEFAULT_LINKS_BY_GROUP[repositoryGroup] || DEFAULT_LINKS_BY_GROUP['1xclub-casinos']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();

    // Suscribirse a cambios en tiempo real para el grupo específico
    const subscription = supabase
      .channel(`landing_phones_changes_${repositoryGroup}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'landing_phones',
          filter: `repository_group=eq.${repositoryGroup}`
        },
        (payload) => {
          console.log('Enlaces actualizados en tiempo real para grupo', repositoryGroup, ':', payload);
          fetchLinks();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [repositoryGroup]);

  return {
    links,
    loading,
    error,
    groupInfo,
    refetch: fetchLinks
  };
};

// Hook de compatibilidad que mantiene la misma interfaz que useGlobalLinks
export const useGlobalLinks = (repositoryGroup = '1xclub-casinos') => {
  return useLandingLinks(repositoryGroup);
};

export default useLandingLinks;
