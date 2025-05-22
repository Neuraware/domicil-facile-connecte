
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Create schema for form validation
const registerSchema = z.object({
  fullName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  companyName: z.string().min(2, {
    message: "Le nom de l'entreprise doit contenir au moins 2 caractères",
  }),
  email: z.string().email({
    message: "Email invalide",
  }),
  phone: z.string().min(8, {
    message: "Le numéro de téléphone doit contenir au moins 8 caractères",
  }),
  address: z.string().min(5, {
    message: "L'adresse doit contenir au moins 5 caractères",
  }),
  city: z.string().min(2, {
    message: "La ville doit contenir au moins 2 caractères",
  }),
  postalCode: z.string().min(4, {
    message: "Le code postal doit contenir au moins 4 caractères",
  }),
  country: z.string().min(2, {
    message: "Le pays doit contenir au moins 2 caractères",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Register user with Supabase Auth
      await signUp(values.email, values.password, {
        fullName: values.fullName,
        companyName: values.companyName,
        phone: values.phone,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        country: values.country,
      });
      
      // Navigate to the subscription page after successful registration
      navigate('/subscription');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  // Helper to navigate between tabs
  const goToNextTab = () => {
    if (activeTab === "account") {
      // Validate first tab fields before moving
      const accountFields = ['fullName', 'companyName', 'email', 'phone'];
      const isValid = accountFields.every(field => {
        const result = form.trigger(field as keyof RegisterFormValues);
        return result;
      });
      
      if (isValid) {
        setActiveTab("address");
      }
    } else if (activeTab === "address") {
      // Validate address fields before moving
      const addressFields = ['address', 'city', 'postalCode', 'country'];
      const isValid = addressFields.every(field => {
        const result = form.trigger(field as keyof RegisterFormValues);
        return result;
      });
      
      if (isValid) {
        setActiveTab("security");
      }
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === "address") {
      setActiveTab("account");
    } else if (activeTab === "security") {
      setActiveTab("address");
    }
  };

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Inscription</CardTitle>
            <CardDescription className="text-center">
              Créez un compte pour accéder à nos services de domiciliation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="account">Compte</TabsTrigger>
                    <TabsTrigger value="address">Adresse</TabsTrigger>
                    <TabsTrigger value="security">Sécurité</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="account" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de l'entreprise</FormLabel>
                            <FormControl>
                              <Input placeholder="Ma Société SAS" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="exemple@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="+33 6 12 34 56 78" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="button" onClick={goToNextTab}>
                        Suivant
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="address" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input placeholder="123 rue de Paris" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input placeholder="Paris" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                              <Input placeholder="75000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <FormControl>
                            <Input placeholder="France" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goToPreviousTab}>
                        Précédent
                      </Button>
                      <Button type="button" onClick={goToNextTab}>
                        Suivant
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goToPreviousTab}>
                        Précédent
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Inscription en cours..." : "S'inscrire"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Déjà inscrit ?{' '}
              <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Register;
