
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Mail, CreditCard, Calendar, Download, Bell } from 'lucide-react';
import { FilePreview } from '@/components/documents/FilePreview';
import { formatDate } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface Document {
  id: string;
  name: string;
  path: string;
  created_at: string;
  status: 'pending' | 'validated' | 'rejected';
  type: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface Subscription {
  status: string;
  current_period_end: string;
  plan: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setProfile(profileData);
        
        // Fetch documents
        const { data: documentsData } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (documentsData) {
          setDocuments(documentsData);
        }
        
        // Fetch notifications
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (notificationsData) {
          setNotifications(notificationsData);
        }
        
        // Fetch subscription status
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (subscriptionData) {
          setSubscription(subscriptionData);
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  // For demo purposes, we're creating mock data
  const mockDocuments = [
    {
      id: '1',
      name: 'Contrat de domiciliation.pdf',
      path: 'documents/contract.pdf',
      created_at: '2023-11-15T14:23:00Z',
      status: 'validated' as const,
      type: 'application/pdf'
    },
    {
      id: '2',
      name: 'Extrait K-bis.pdf',
      path: 'documents/kbis.pdf',
      created_at: '2023-11-10T09:45:00Z',
      status: 'validated' as const,
      type: 'application/pdf'
    },
    {
      id: '3',
      name: 'Pièce d\'identité.jpg',
      path: 'documents/id.jpg',
      created_at: '2023-11-08T11:30:00Z',
      status: 'validated' as const,
      type: 'image/jpeg'
    }
  ];
  
  const mockNotifications = [
    {
      id: '1',
      title: 'Document validé',
      message: 'Votre contrat de domiciliation a été validé.',
      created_at: '2023-11-15T15:00:00Z',
      read: false
    },
    {
      id: '2',
      title: 'Nouveau courrier',
      message: 'Vous avez reçu un nouveau courrier qui a été scanné et ajouté à votre espace documents.',
      created_at: '2023-11-12T10:30:00Z',
      read: false
    },
    {
      id: '3',
      title: 'Rappel de paiement',
      message: 'Votre prochain paiement est prévu dans 5 jours.',
      created_at: '2023-11-10T09:00:00Z',
      read: true
    }
  ];
  
  const mockSubscription = {
    status: 'active',
    current_period_end: '2023-12-15T00:00:00Z',
    plan: 'Formule Standard'
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue, {profile?.full_name || user?.email?.split('@')[0] || 'Client'}
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate('/subscription')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Gérer mon abonnement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Documents"
            value={documents.length || mockDocuments.length}
            description="Documents validés et en attente"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatsCard
            title="Courriers"
            value="3"
            description="Courriers reçus ce mois-ci"
            icon={<Mail className="h-5 w-5" />}
          />
          <StatsCard
            title="Abonnement"
            value={subscription?.status === 'active' ? 'Actif' : 'Inactif'}
            description={`Expire le ${formatDate(subscription?.current_period_end || mockSubscription.current_period_end)}`}
            icon={<CreditCard className="h-5 w-5" />}
          />
          <StatsCard
            title="Prochaine facture"
            value="49,99 €"
            description={`Prélèvement le ${formatDate('2024-01-15')}`}
            icon={<Calendar className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-xl">Documents récents</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/documents')}>
                Voir tous
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">Chargement...</div>
                ) : documents.length > 0 ? (
                  documents.map((doc) => (
                    <FilePreview
                      key={doc.id}
                      filePath={doc.path}
                      fileName={doc.name}
                      uploadDate={doc.created_at}
                      status={doc.status}
                      onViewClick={() => navigate(`/documents/${doc.id}`)}
                    />
                  ))
                ) : (
                  mockDocuments.map((doc) => (
                    <FilePreview
                      key={doc.id}
                      filePath={doc.path}
                      fileName={doc.name}
                      uploadDate={doc.created_at}
                      status={doc.status}
                      onViewClick={() => navigate(`/documents/${doc.id}`)}
                    />
                  ))
                )}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={() => navigate('/documents/upload')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Télécharger un nouveau document
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle className="text-xl">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">Chargement...</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? '' : 'bg-muted'}`}>
                      <div className="flex justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  mockNotifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? '' : 'bg-muted'}`}>
                      <div className="flex justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Résumé de l'abonnement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Plan actuel</h4>
                <div className="p-4 rounded-lg border bg-muted">
                  <div className="font-bold text-lg mb-1">{subscription?.plan || mockSubscription.plan}</div>
                  <div className="text-sm text-muted-foreground mb-3">49,99 € / mois</div>
                  <Button size="sm" onClick={() => navigate('/subscription')}>
                    Changer de plan
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Statut</h4>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`h-3 w-3 rounded-full ${subscription?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="font-medium">
                      {subscription?.status === 'active' ? 'Actif' : 'En attente'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Renouvellement le {formatDate(subscription?.current_period_end || mockSubscription.current_period_end)}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Documents</h4>
                <div className="p-4 rounded-lg border">
                  <Button variant="outline" className="w-full mb-2" onClick={() => navigate('/documents/contract')}>
                    <Download className="h-4 w-4 mr-2" />
                    Contrat
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/documents/invoices')}>
                    <Download className="h-4 w-4 mr-2" />
                    Factures
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
