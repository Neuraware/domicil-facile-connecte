
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto py-4">
          <div className="text-xl font-bold mb-4 text-primary">
            Administration
          </div>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
