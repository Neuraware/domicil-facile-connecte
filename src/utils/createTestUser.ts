
import { supabase } from '@/integrations/supabase/client';

export const createTestUser = async () => {
  try {
    const testUser = {
      email: 'test@example.com',
      password: 'Password123!',
      fullName: 'Utilisateur Test',
      companyName: 'Entreprise Test SAS',
      phone: '+33612345678',
      address: '123 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      country: 'France'
    };
    
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.fullName,
          company_name: testUser.companyName,
          phone: testUser.phone,
        },
      },
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Créer le profil utilisateur
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: testUser.fullName,
        company_name: testUser.companyName,
        phone: testUser.phone,
        address: testUser.address,
        city: testUser.city,
        postal_code: testUser.postalCode,
        country: testUser.country,
        user_type: 'client',
      });
      
      if (profileError) throw profileError;
    }
    
    console.log('Utilisateur test créé avec succès!', {
      email: testUser.email,
      password: testUser.password
    });
    
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'utilisateur test:', error.message);
    return { success: false, error: error.message };
  }
};

// Pour utiliser cette fonction dans la console du navigateur:
// import { createTestUser } from './utils/createTestUser';
// createTestUser().then(console.log);
