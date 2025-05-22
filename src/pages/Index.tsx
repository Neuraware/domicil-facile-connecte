
import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Building, MailOpen, Clock } from 'lucide-react';

const Home = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-domicile-blue/80 to-domicile-teal/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Solution de domiciliation professionnelle pour votre entreprise
            </h1>
            <p className="text-xl mb-8">
              Simplifiez la gestion administrative de votre entreprise grâce à notre service de domiciliation. Une adresse prestigieuse, une gestion efficace de votre courrier et un accompagnement personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-domicile-blue hover:bg-gray-100 w-full sm:w-auto">
                  Commencer maintenant
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Découvrir nos services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos services de domiciliation</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tous les services dont vous avez besoin pour une gestion administrative efficace de votre entreprise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="feature-card">
              <Building className="feature-card-icon" />
              <h3 className="text-xl font-semibold mb-2">Adresse professionnelle</h3>
              <p className="text-muted-foreground">
                Une adresse professionnelle prestigieuse pour votre siège social ou établissement secondaire.
              </p>
            </Card>
            
            <Card className="feature-card">
              <MailOpen className="feature-card-icon" />
              <h3 className="text-xl font-semibold mb-2">Gestion de courrier</h3>
              <p className="text-muted-foreground">
                Réception, numérisation et transfert de votre courrier selon vos besoins.
              </p>
            </Card>
            
            <Card className="feature-card">
              <FileText className="feature-card-icon" />
              <h3 className="text-xl font-semibold mb-2">Documents légaux</h3>
              <p className="text-muted-foreground">
                Aide à la préparation des documents légaux et administratifs pour votre entreprise.
              </p>
            </Card>
            
            <Card className="feature-card">
              <Clock className="feature-card-icon" />
              <h3 className="text-xl font-semibold mb-2">Secrétariat</h3>
              <p className="text-muted-foreground">
                Services de secrétariat sur-mesure pour vos besoins administratifs ponctuels.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à domicilier votre entreprise ?</h2>
            <p className="text-lg mb-8">
              Notre processus est entièrement en ligne. Inscrivez-vous, téléchargez vos documents, signez électroniquement et recevez votre contrat immédiatement.
            </p>
            <div className="flex justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-domicile-blue text-white hover:bg-domicile-blue/90">
                  Commencer maintenant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que nos clients disent</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez pourquoi nos clients nous font confiance pour la domiciliation de leur entreprise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex text-domicile-orange">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mb-4 text-muted-foreground">
                "Un service de domiciliation impeccable. Réactivité, professionnalisme et simplicité d'utilisation. Je recommande vivement !"
              </p>
              <div>
                <p className="font-semibold">Sophie Martin</p>
                <p className="text-sm text-muted-foreground">Fondatrice, DigitalNova</p>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex text-domicile-orange">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mb-4 text-muted-foreground">
                "Une adresse prestigieuse dans Paris et une gestion de courrier impeccable. Exactement ce dont j'avais besoin pour mon entreprise de conseil."
              </p>
              <div>
                <p className="font-semibold">Thomas Dubois</p>
                <p className="text-sm text-muted-foreground">Directeur, TD Consulting</p>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="mb-4">
                <div className="flex text-domicile-orange">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mb-4 text-muted-foreground">
                "Le processus d'inscription était incroyablement fluide. En quelques clics, j'ai pu obtenir une domiciliation pour ma startup. Très satisfait !"
              </p>
              <div>
                <p className="font-semibold">Julie Lemaire</p>
                <p className="text-sm text-muted-foreground">CEO, GreenTech Solutions</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;
