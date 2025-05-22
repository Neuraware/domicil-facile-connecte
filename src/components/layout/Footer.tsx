
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background mt-auto border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">DomiciLink</h3>
            <p className="text-sm text-muted-foreground mb-4">
              La solution professionnelle pour la domiciliation de votre entreprise.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Domiciliation d'entreprise</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gestion de courrier</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Secrétariat</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Location de bureaux</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">À propos de nous</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">1 rue de la Paix, 75001 Paris</li>
              <li className="text-sm text-muted-foreground">contact@domicilink.fr</li>
              <li className="text-sm text-muted-foreground">+33 1 23 45 67 89</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DomiciLink. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Conditions générales</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Politique de confidentialité</Link>
              <Link to="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mentions légales</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
