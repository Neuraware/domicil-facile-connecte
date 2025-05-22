
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/utils';
import { 
  Bell, 
  Menu, 
  User,
  X,
  LogOut,
  Settings,
  FileText,
  Home,
  CreditCard
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-poppins font-bold bg-clip-text text-transparent bg-gradient-to-r from-domicile-blue to-domicile-teal">
                DomiciLink
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center space-x-6">
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                Accueil
              </Link>
              {!user && (
                <>
                  <Link to="/services" className={`nav-link ${isActive('/services')}`}>
                    Services
                  </Link>
                  <Link to="/pricing" className={`nav-link ${isActive('/pricing')}`}>
                    Tarifs
                  </Link>
                  <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
                    Contact
                  </Link>
                </>
              )}
              {user && !isAdmin(user) && (
                <>
                  <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                    Mon Espace
                  </Link>
                  <Link to="/documents" className={`nav-link ${isActive('/documents')}`}>
                    Documents
                  </Link>
                  <Link to="/subscription" className={`nav-link ${isActive('/subscription')}`}>
                    Abonnement
                  </Link>
                </>
              )}
              {user && isAdmin(user) && (
                <>
                  <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
                    Administration
                  </Link>
                  <Link to="/admin/users" className={`nav-link ${isActive('/admin/users')}`}>
                    Clients
                  </Link>
                  <Link to="/admin/documents" className={`nav-link ${isActive('/admin/documents')}`}>
                    Documents
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <NotificationDropdown />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!isAdmin(user) && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                            <Home className="h-4 w-4" /> 
                            Tableau de bord
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/documents" className="flex items-center gap-2 cursor-pointer">
                            <FileText className="h-4 w-4" /> 
                            Mes documents
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/subscription" className="flex items-center gap-2 cursor-pointer">
                            <CreditCard className="h-4 w-4" /> 
                            Mon abonnement
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" /> 
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={signOut}
                      className="flex items-center gap-2 cursor-pointer text-red-500"
                    >
                      <LogOut className="h-4 w-4" /> 
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button>S'inscrire</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Open Menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-4 bg-background border-b border-border">
          {user ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.email}</span>
                </div>
                <NotificationDropdown />
              </div>
              
              {!isAdmin(user) ? (
                <>
                  <Link to="/dashboard" className="block py-2 font-medium" onClick={toggleMenu}>
                    Mon Espace
                  </Link>
                  <Link to="/documents" className="block py-2" onClick={toggleMenu}>
                    Mes documents
                  </Link>
                  <Link to="/subscription" className="block py-2" onClick={toggleMenu}>
                    Mon abonnement
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/admin" className="block py-2 font-medium" onClick={toggleMenu}>
                    Administration
                  </Link>
                  <Link to="/admin/users" className="block py-2" onClick={toggleMenu}>
                    Clients
                  </Link>
                  <Link to="/admin/documents" className="block py-2" onClick={toggleMenu}>
                    Documents
                  </Link>
                </>
              )}
              <Link to="/profile" className="block py-2" onClick={toggleMenu}>
                Paramètres
              </Link>
              <button 
                onClick={() => {
                  signOut();
                  toggleMenu();
                }} 
                className="block w-full text-left py-2 text-red-500"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="block py-2 font-medium" onClick={toggleMenu}>
                Accueil
              </Link>
              <Link to="/services" className="block py-2" onClick={toggleMenu}>
                Services
              </Link>
              <Link to="/pricing" className="block py-2" onClick={toggleMenu}>
                Tarifs
              </Link>
              <Link to="/contact" className="block py-2" onClick={toggleMenu}>
                Contact
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/register" onClick={toggleMenu}>
                  <Button className="w-full">S'inscrire</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
