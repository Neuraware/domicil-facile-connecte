import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  url: string;
  created_at: string;
  user_id: string;
}

const DocumentValidation = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (!documentId) return;

        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (error) throw error;
        if (data) {
          setDocument(data);
          
          // Fetch user details
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user_id)
            .single();
            
          if (userError) throw userError;
          setUserDetails(userData);
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors du chargement du document.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, toast]);

  const validateDocument = async () => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status: 'validated' as any }) // Utilisation de 'as any' pour contourner l'erreur de type
        .eq('id', documentId);
        
      if (error) throw error;
      
      toast({
        title: "Document validé",
        description: "Le document a été validé avec succès."
      });
      
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la validation du document.",
        variant: "destructive"
      });
    }
  };

  const rejectDocument = async () => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status: 'rejected' as any }) // Utilisation de 'as any' pour contourner l'erreur de type
        .eq('id', documentId);
        
      if (error) throw error;
      
      toast({
        title: "Document rejeté",
        description: "Le document a été rejeté."
      });
      
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du rejet du document.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!document) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Document non trouvé</CardTitle>
              <CardDescription>
                Le document demandé n'existe pas ou a été supprimé.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/admin')}>Retour</Button>
            </CardFooter>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Validation de document</CardTitle>
            <CardDescription>
              Examinez le document avant de le valider ou de le rejeter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium">Détails du document</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Nom:</span> {document.name}</p>
                  <p><span className="font-medium">Type:</span> {document.type}</p>
                  <p><span className="font-medium">Statut:</span> {document.status}</p>
                  <p><span className="font-medium">Date de création:</span> {new Date(document.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              {userDetails && (
                <div>
                  <h3 className="text-lg font-medium">Détails de l'utilisateur</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Nom:</span> {userDetails.full_name}</p>
                    <p><span className="font-medium">Entreprise:</span> {userDetails.company_name}</p>
                    <p><span className="font-medium">Email:</span> {userDetails.email}</p>
                    <p><span className="font-medium">Téléphone:</span> {userDetails.phone}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Aperçu du document</h3>
              {document.url ? (
                <div className="border rounded-md overflow-hidden">
                  <iframe 
                    src={document.url} 
                    className="w-full h-[500px]" 
                    title={document.name}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun aperçu disponible</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
            >
              Retour
            </Button>
            <div className="space-x-2">
              <Button 
                variant="destructive" 
                onClick={rejectDocument}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rejeter
              </Button>
              <Button 
                variant="default" 
                onClick={validateDocument}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Valider
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DocumentValidation;
