import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Mail, CreditCard, Calendar, Download, Bell } from 'lucide-react';
import { FilePreview } from '@/components/documents/FilePreview';
import { formatDate, formatCurrency } from '@/lib/utils';
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
  id: string;
  status: string;
  current_period_end: string;
  plan_id: string;
  price: number;
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
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Fetch documents
        const { data: documentsData, error: documentsError } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (documentsError) throw documentsError;
        setDocuments(documentsData || []);
        
        // Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (notificationsError) throw notificationsError;
        setNotifications(notificationsData || []);
        
        // Fetch subscription status
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (subscriptionError && subscriptionError.code !== 'PGRST116') {
          throw subscriptionError;
        }
        setSubscription(subscriptionData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  const getSubscriptionStatus = () => {
    if (!subscription) {
      return {
        status: 'Non abonné',
        description: 'Aucun abonnement actif',
        nextBilling: null
      };
    }

    return {
      status: subscription.status === 'active' ? 'Actif' : 'Inactif',
      description: `${formatCurrency(subscription.price)} / mois`,
      nextBilling: subscription.current_period_end
    };
  };

  const subscriptionInfo = getSubscriptionStatus();

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
            value={documents.length}
            description={`${documents.filter(d => d.status === 'pending').length} en attente`}
            icon={<FileText className="h-5 w-5" />}
          />
          <StatsCard
            title="Courriers"
            value={notifications.filter(n => n.title.includes('courrier')).length}
            description="Courriers reçus ce mois-ci"
            icon={<Mail className="h-5 w-5" />}
          />
          <StatsCard
            title="Abonnement"
            value={subscriptionInfo.status}
            description={subscriptionInfo.description}
            icon={<CreditCard className="h-5 w-5" />}
          />
          <StatsCard
            title="Prochaine facture"
            value={subscription ? formatCurrency(subscription.price) : 'N/A'}
            description={subscriptionInfo.nextBilling ? `Prélèvement le ${formatDate(subscriptionInfo.nextBilling)}` : 'Aucun abonnement'}
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
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun document
                  </div>
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
                  <div className="text-center py-4 text-muted-foreground">
                    Aucune notification
                  </div>
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
                  <div className="font-bold text-lg mb-1">
                    {subscription ? subscription.plan_id : 'Aucun abonnement'}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {subscription ? `${formatCurrency(subscription.price)} / mois` : 'Commencez dès maintenant'}
                  </div>
                  <Button size="sm" onClick={() => navigate('/subscription')}>
                    {subscription ? 'Changer de plan' : 'Souscrire'}
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Statut</h4>
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`h-3 w-3 rounded-full ${subscription?.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="font-medium">
                      {subscriptionInfo.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {subscriptionInfo.nextBilling ? 
                      `Renouvellement le ${formatDate(subscriptionInfo.nextBilling)}` : 
                      'Aucun renouvellement prévu'}
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