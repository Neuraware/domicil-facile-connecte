
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Bell, 
  CreditCard,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';

// Mock data for admin dashboard
const mockUsers = [
  { 
    id: '1', 
    name: 'Sophie Martin', 
    company: 'DigitalNova SARL',
    email: 'sophie@digitalnova.fr',
    status: 'active',
    joined: '2023-10-15T10:30:00Z',
    documents: 5,
    subscription: 'Standard'
  },
  { 
    id: '2', 
    name: 'Thomas Dubois', 
    company: 'TD Consulting SAS',
    email: 'thomas@tdconsulting.fr',
    status: 'active',
    joined: '2023-11-02T14:45:00Z',
    documents: 3,
    subscription: 'Premium'
  },
  { 
    id: '3', 
    name: 'Julie Lemaire', 
    company: 'GreenTech Solutions SAS',
    email: 'julie@greentech.fr',
    status: 'pending',
    joined: '2023-11-10T09:15:00Z',
    documents: 2,
    subscription: 'Basic'
  },
];

const mockDocuments = [
  {
    id: '1',
    name: 'Pièce d\'identité - Sophie Martin.pdf',
    userId: '1',
    userName: 'Sophie Martin',
    company: 'DigitalNova SARL',
    status: 'pending',
    uploaded: '2023-11-14T11:30:00Z',
    type: 'ID'
  },
  {
    id: '2',
    name: 'Extrait K-bis - TD Consulting.pdf',
    userId: '2',
    userName: 'Thomas Dubois',
    company: 'TD Consulting SAS',
    status: 'validated',
    uploaded: '2023-11-12T09:45:00Z',
    type: 'K-bis'
  },
  {
    id: '3',
    name: 'Statuts - GreenTech Solutions.pdf',
    userId: '3',
    userName: 'Julie Lemaire',
    company: 'GreenTech Solutions SAS',
    status: 'pending',
    uploaded: '2023-11-10T14:20:00Z',
    type: 'Statuts'
  },
  {
    id: '4',
    name: 'Justificatif de domicile - Sophie Martin.pdf',
    userId: '1',
    userName: 'Sophie Martin',
    company: 'DigitalNova SARL',
    status: 'rejected',
    uploaded: '2023-11-09T16:15:00Z',
    type: 'Address'
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocuments = mockDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingDocuments = mockDocuments.filter(doc => doc.status === 'pending').length;
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="success">Actif</Badge>;
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspendu</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  const getDocumentStatusBadge = (status: string) => {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Administration</h1>
            <p className="text-muted-foreground">
              Gérez les utilisateurs, les documents et les abonnements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Utilisateurs"
            value={mockUsers.length}
            description={`${mockUsers.filter(u => u.status === 'active').length} utilisateurs actifs`}
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            title="Documents"
            value={mockDocuments.length}
            description={`${pendingDocuments} documents en attente de validation`}
            icon={<FileText className="h-5 w-5" />}
          />
          <StatsCard
            title="Abonnements"
            value={mockUsers.filter(u => u.status === 'active').length}
            description="Abonnements actifs"
            icon={<CreditCard className="h-5 w-5" />}
          />
          <StatsCard
            title="Notifications"
            value="5"
            description="Envoyées cette semaine"
            icon={<Bell className="h-5 w-5" />}
          />
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur, un document..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle className="text-xl">Utilisateurs récents</CardTitle>
                <CardDescription>
                  Gérez les utilisateurs et leurs abonnements
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
                Voir tous
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 rounded-lg border hover:bg-accent hover:cursor-pointer" onClick={() => navigate(`/admin/users/${user.id}`)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.company}</p>
                          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {getStatusBadge(user.status)}
                            <span className="text-xs text-muted-foreground">
                              Inscrit le {formatDate(user.joined)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{user.documents} documents</p>
                          <p className="text-sm text-muted-foreground">{user.subscription}</p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle className="text-xl">Documents à valider</CardTitle>
                <CardDescription>
                  Validez ou rejetez les documents téléchargés par les utilisateurs
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/documents')}>
                Voir tous
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 rounded-lg border hover:bg-accent hover:cursor-pointer" onClick={() => navigate(`/admin/documents/${doc.id}`)}>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">{doc.company}</p>
                          <p className="text-sm text-muted-foreground">{doc.userName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {getDocumentStatusBadge(doc.status)}
                            <span className="text-xs text-muted-foreground">
                              Téléchargé le {formatDate(doc.uploaded)}
                            </span>
                          </div>
                        </div>
                        {doc.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucun document trouvé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button onClick={() => navigate('/admin/users/create')} className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                <Users className="h-6 w-6" />
                <span>Ajouter un utilisateur</span>
              </Button>
              
              <Button onClick={() => navigate('/admin/documents')} variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                <FileText className="h-6 w-6" />
                <span>Valider des documents</span>
              </Button>
              
              <Button onClick={() => navigate('/admin/notifications/create')} variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                <Bell className="h-6 w-6" />
                <span>Envoyer une notification</span>
              </Button>
              
              <Button onClick={() => navigate('/admin/subscriptions')} variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                <CreditCard className="h-6 w-6" />
                <span>Gérer les abonnements</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
