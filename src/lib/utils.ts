
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jsPDF } from 'jspdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const generateContractPDF = async (userData: any): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Add logo and header
  doc.setFontSize(20);
  doc.setTextColor(26, 58, 110); // #1a3a6e
  doc.text("CONTRAT DE DOMICILIATION", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("ENTRE LES SOUSSIGNÉS :", 20, 40);
  
  doc.setFontSize(10);
  doc.text("La société DomiciLink, société par actions simplifiée au capital de 10 000 euros,", 20, 50);
  doc.text("immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789,", 20, 55);
  doc.text("dont le siège social est situé au 1 rue de la Paix, 75001 Paris, France,", 20, 60);
  doc.text("ci-après dénommée « le Prestataire »,", 20, 65);
  
  doc.text("ET", 105, 75, { align: "center" });
  
  doc.text(`La société ${userData.companyName || '[Nom de la société]'},`, 20, 85);
  doc.text(`représentée par ${userData.fullName || '[Nom du représentant]'},`, 20, 90);
  doc.text(`domiciliée au ${userData.address || '[Adresse]'}, ${userData.postalCode || '[Code postal]'} ${userData.city || '[Ville]'}, ${userData.country || '[Pays]'},`, 20, 95);
  doc.text("ci-après dénommée « le Client »,", 20, 100);
  
  doc.text("IL A ÉTÉ CONVENU CE QUI SUIT :", 20, 110);
  
  // Contract text
  doc.setFontSize(11);
  doc.text("Article 1 : Objet du contrat", 20, 120);
  doc.setFontSize(10);
  doc.text("Le Prestataire s'engage à fournir au Client une prestation de domiciliation d'entreprise conformément", 20, 130);
  doc.text("aux dispositions légales et réglementaires en vigueur.", 20, 135);
  
  doc.setFontSize(11);
  doc.text("Article 2 : Durée", 20, 145);
  doc.setFontSize(10);
  doc.text("Le présent contrat est conclu pour une durée de 12 mois à compter de sa signature.", 20, 155);
  doc.text("Il sera ensuite renouvelable par tacite reconduction pour des périodes d'égale durée, sauf dénonciation", 20, 160);
  doc.text("par l'une des parties notifiée par lettre recommandée avec accusé de réception 3 mois avant l'échéance.", 20, 165);
  
  // More contract articles...
  
  // Signatures
  doc.setFontSize(11);
  doc.text("Fait à Paris, le " + new Date().toLocaleDateString('fr-FR'), 20, 240);
  
  doc.text("Le Prestataire", 50, 255);
  doc.text("Le Client", 150, 255);
  
  doc.text("Signature", 50, 270);
  doc.text("Signature", 150, 270);
  
  // Output as blob
  const blob = doc.output('blob');
  return blob;
};

export const getFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  if (imageExtensions.includes(extension)) return 'image';
  
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  if (documentExtensions.includes(extension)) return 'document';
  
  return 'other';
};

export function isAdmin(user: any): boolean {
  if (!user) return false;
  return user?.user_metadata?.user_type === 'admin' || false;
}

export function getIconByFileExtension(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  switch(extension) {
    case 'pdf':
      return 'file-text';
    case 'doc':
    case 'docx':
      return 'file-text';
    case 'xls':
    case 'xlsx':
      return 'file-text';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
      return 'file';
    default:
      return 'file';
  }
}
