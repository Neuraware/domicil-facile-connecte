
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FilePreview } from '@/components/documents/FilePreview';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { 
  CheckCircle,
  XCircle,
  UserRound,
  Building,
  Calendar,
  FileText,
  Send
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useNavigate } from 'react-router-dom';

// Mock document data
const mockDocument = {
  id: '123',
  name: 'Pièce d\'identité.pdf',
  path: 'documents/123.pdf',
  type: 'ID',
  created_at: '2023-11-15T14:23:00Z',
  status: 'pending' as const,
  user: {
    id: '456',
    full_name: 'Sophie Martin',
    company_name: 'DigitalNova SARL',
    email: 'sophie@digitalnova.fr'
  }
};

const DocumentValidation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(mockDocument);
  const [viewerOpen, setViewerOpen] = useState(false);

  // In a real application, we would fetch the document data
  // useEffect(() => {
  //   const fetchDocument = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from('documents')
  //         .select(`
  //           *,
  //           user:user_id (
  //             id,
  //             full_name,
  //             company_name,
  //             email
  //           )
  //         `)
  //         .eq('id', id)
  //         .single();
          
  //       if (error) throw error;
  //       setDocument(data);
  //     } catch (error) {
  //       console.error('Error fetching document:', error);
  //     }
  //   };
    
  //   fetchDocument();
  // }, [id]);

  const handleValidate = async () => {
    setLoading(true);
    try {
      // In a real application, update the document status in the database
      // const { error } = await supabase
      //   .from('documents')
      //   .update({ status: 'validated' })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Send notification to the user
      // await supabase.from('notifications').insert({
      //   user_id: document.user.id,
      //   title: 'Document validé',
      //   message: message || `Votre document "${document.name}" a été validé.`,
      //   type: 'success'
      // });

      setDocument({ ...document, status: 'validated' });
      
      toast({
        title: 'Document validé',
        description: 'Le document a été validé avec succès.',
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Error validating document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la validation du document.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!message) {
      toast({
        title: 'Message requis',
        description: 'Veuillez fournir une raison pour le rejet du document.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    try {
      // In a real application, update the document status in the database
      // const { error } = await supabase
      //   .from('documents')
      //   .update({ 
      //     status: 'rejected',
      //     rejection_reason: message
      //   })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Send notification to the user
      // await supabase.from('notifications').insert({
      //   user_id: document.user.id,
      //   title: 'Document refusé',
      //   message: `Votre document "${document.name}" a été refusé. Raison: ${message}`,
      //   type: 'error'
      // });
      
      setDocument({ ...document, status: 'rejected' });
      
      toast({
        title: 'Document refusé',
        description: 'Le document a été refusé avec succès.',
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du rejet du document.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message) {
      toast({
        title: 'Message requis',
        description: 'Veuillez écrire un message avant de l\'envoyer.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    try {
      // In a real application, send a notification to the user
      // await supabase.from('notifications').insert({
      //   user_id: document.user.id,
      //   title: 'Message concernant votre document',
      //   message: `Message concernant "${document.name}": ${message}`,
      //   type: 'info'
      // });
      
      toast({
        title: 'Message envoyé',
        description: 'Le message a été envoyé avec succès.',
        variant: 'default'
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi du message.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'validated':
        return <Badge variant="success">Validé</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/documents')}
          className="mb-4"
        >
          ← Retour aux documents
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Validation de document</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du document</CardTitle>
                <CardDescription>
                  {document.name} - {getStatusBadge(document.status)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] bg-muted rounded-md flex items-center justify-center mb-4">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Nom du fichier</h3>
                    <p>{document.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type de document</h3>
                    <p>{document.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Date de téléchargement</h3>
                    <p>{formatDate(document.created_at)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Statut</h3>
                    <p>{getStatusBadge(document.status)}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button onClick={() => setViewerOpen(true)} className="w-full md:w-auto">
                    Ouvrir le document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informations client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Nom</p>
                      <p className="text-sm text-muted-foreground">{document.user.full_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Entreprise</p>
                      <p className="text-sm text-muted-foreground">{document.user.company_name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{document.user.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => navigate(`/admin/users/${document.user.id}`)}>
                    Voir le profil complet
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Entrez un message pour le client (optionnel pour la validation, obligatoire pour le rejet)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-24"
                  />
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={handleValidate}
                      disabled={loading || document.status !== 'pending'}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Valider le document
                    </Button>
                    
                    <Button
                      onClick={handleReject}
                      disabled={loading || document.status !== 'pending' || !message}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Refuser le document
                    </Button>
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={loading || !message}
                      variant="outline"
                      className="w-full"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer un message
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  La validation ou le rejet du document enverra automatiquement une notification au client.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentValidation;
