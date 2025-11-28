/**
 * Hook personalizado para obtener números de teléfono específicos por landing desde Supabase
 * Usado por las landings para obtener su número de teléfono asignado
 * Soporta detección automática por subdominio y configuración individual
 */

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Número por defecto como fallback
const DEFAULT_PHONE = {
  phone_number: '+5491123456789',
  whatsapp_link: 'https://wa.link/9l7tig',
  telegram_link: 'https://t.me/jugadirecto',
  description: 'Número por defecto',
  title: 'Casino por defecto'
};

/**
 * Detecta el número de landing basado en el subdominio
 * @returns {number|null} Número de landing (1-10) o null si no es un subdominio válido
 */
const detectLandingFromSubdomain = () => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  
  // Verificar si es un número del 1 al 10
  if (/^[1-9]$|^10$/.test(subdomain)) {
    return parseInt(subdomain);
  }
  
  return null;
};

export const useLandingPhone = (landingNumber) => {
  const [phoneData, setPhoneData] = useState(DEFAULT_PHONE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Detectar automáticamente el número de landing si no se proporciona
  const finalLandingNumber = landingNumber || detectLandingFromSubdomain();

  const fetchLandingPhone = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validar número de landing
      if (!finalLandingNumber || finalLandingNumber < 1 || finalLandingNumber > 10) {
        console.warn('Número de landing inválido:', finalLandingNumber);
        setPhoneData(DEFAULT_PHONE);
        return;
      }

      // Intentar obtener número específico desde Supabase
      const { data, error: supabaseError } = await supabase
        .from('landing_phones')
        .select('whatsapp_link, telegram_link, description, is_active, individual_title, individual_whatsapp_link, individual_telegram_link, use_individual_settings, use_individual_telegram')
        .eq('landing_number', finalLandingNumber)
        .eq('is_active', true)
        .single();

      if (supabaseError) {
        console.warn(`Error al obtener número para landing ${finalLandingNumber}:`, supabaseError.message);
        console.log('Usando número por defecto');
        setPhoneData(DEFAULT_PHONE);
      } else if (data) {
        console.log(`Número obtenido para landing ${finalLandingNumber}:`, data);
        
        // Decidir si usar configuración individual o por grupos
        const useIndividualWhatsApp = data.use_individual_settings && data.individual_whatsapp_link;
        const useIndividualTelegram = data.use_individual_telegram && data.individual_telegram_link;
        const useIndividualTitle = data.use_individual_settings && data.individual_title;
        
        setPhoneData({
          phone_number: DEFAULT_PHONE.phone_number, // Usar siempre el número por defecto ya que no está en la tabla
          whatsapp_link: useIndividualWhatsApp ? data.individual_whatsapp_link : (data.whatsapp_link || DEFAULT_PHONE.whatsapp_link),
          telegram_link: useIndividualTelegram ? data.individual_telegram_link : (data.telegram_link || DEFAULT_PHONE.telegram_link),
          description: data.description || DEFAULT_PHONE.description,
          title: useIndividualTitle ? data.individual_title : DEFAULT_PHONE.title,
          useIndividualSettings: data.use_individual_settings || false,
          useIndividualTelegram: data.use_individual_telegram || false
        });
      } else {
        console.log(`No se encontró número para landing ${landingNumber}, usando por defecto`);
        setPhoneData(DEFAULT_PHONE);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError(err.message);
      setPhoneData(DEFAULT_PHONE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (finalLandingNumber) {
      fetchLandingPhone();

      // Suscribirse a cambios en tiempo real
      const subscription = supabase
        .channel('landing_phones_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'landing_phones',
            filter: `landing_number=eq.${finalLandingNumber}`
          },
          (payload) => {
            console.log(`Número de landing ${finalLandingNumber} actualizado en tiempo real:`, payload);
            fetchLandingPhone();
          }
        )
        .subscribe();

      // Cleanup
      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Si no hay número de landing, usar valores por defecto
      setPhoneData(DEFAULT_PHONE);
      setLoading(false);
    }
  }, [finalLandingNumber]);

  return {
    phoneData,
    loading,
    error,
    landingNumber: finalLandingNumber,
    refetch: fetchLandingPhone
  };
};

export default useLandingPhone;

/**
 * Hook para obtener todos los números de landing (útil para el admin panel)
 */
export const useAllLandingPhones = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllPhones = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('landing_phones')
        .select('*')
        .order('landing_number', { ascending: true });

      if (supabaseError) {
        console.error('Error al obtener todos los números:', supabaseError.message);
        setError(supabaseError.message);
        setPhones([]);
      } else {
        setPhones(data || []);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError(err.message);
      setPhones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPhones();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('all_landing_phones_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'landing_phones'
        },
        (payload) => {
          console.log('Números de landing actualizados en tiempo real:', payload);
          fetchAllPhones();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    phones,
    loading,
    error,
    refetch: fetchAllPhones
  };
};
