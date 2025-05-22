
import React from 'react';
import { supabase } from '@/lib/supabase';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, getIconByFileExtension } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FilePreviewProps {
  filePath: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
  uploadDate?: string;
  status?: 'pending' | 'validated' | 'rejected';
  showActions?: boolean;
  onViewClick?: () => void;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  filePath,
  fileName,
  fileType,
  fileSize,
  uploadDate,
  status = 'pending',
  showActions = true,
  onViewClick,
  className = '',
}) => {
  const downloadFile = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(filePath.split('/')[0])
        .download(filePath.replace(`${filePath.split('/')[0]}/`, ''));
      
      if (error) {
        throw error;
      }
      
      // Create a URL for the file blob
      const url = URL.createObjectURL(data);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error downloading file:', error.message);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'validated':
        return <Badge variant="success">Validé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="warning">En attente</Badge>;
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm truncate" title={fileName}>
              {fileName}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              {fileType && <span className="text-xs text-muted-foreground">{fileType}</span>}
              {fileSize && (
                <span className="text-xs text-muted-foreground">
                  {(fileSize / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
              {uploadDate && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(uploadDate)}
                </span>
              )}
            </div>
            <div className="mt-2">
              {getStatusBadge()}
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={onViewClick}
              title="Voir le fichier"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={downloadFile}
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
