
import React, { useState } from 'react';
import { FileUp, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FileUploadProps {
  bucketName: string;
  folder: string;
  fileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  className?: string;
  onUploadComplete?: (files: Array<{ path: string; name: string }>) => void;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  bucketName,
  folder,
  fileTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  className = '',
  onUploadComplete,
  label = 'Déposer des fichiers ici ou cliquer pour sélectionner'
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ path: string; name: string }>>([]);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (fileList: FileList): File[] => {
    const validFiles: File[] = [];
    const currentFileCount = files.length;
    
    if (currentFileCount + fileList.length > maxFiles) {
      setError(`Vous ne pouvez pas télécharger plus de ${maxFiles} fichiers.`);
      return [];
    }
    
    Array.from(fileList).forEach((file) => {
      // Check file size
      if (file.size > maxFileSize) {
        setError(`Le fichier ${file.name} dépasse la taille maximale de ${maxFileSize / (1024 * 1024)}MB.`);
        return;
      }
      
      // Check file type
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!fileTypes.includes(fileExtension) && !fileTypes.includes('*')) {
        setError(`Le type de fichier ${fileExtension} n'est pas accepté. Types acceptés : ${fileTypes.join(', ')}`);
        return;
      }
      
      validFiles.push(file);
    });
    
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    
    if (e.dataTransfer.files) {
      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setError(null);
    const uploaded: Array<{ path: string; name: string }> = [];
    
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);
        
        if (uploadError) {
          throw new Error(`Erreur lors du téléchargement de ${file.name}: ${uploadError.message}`);
        }
        
        uploaded.push({
          path: data.path,
          name: file.name
        });
      }
      
      setUploadedFiles(uploaded);
      setUploadComplete(true);
      
      if (onUploadComplete) {
        onUploadComplete(uploaded);
      }
      
      // Clear files after successful upload
      setFiles([]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">{label}</p>
        <p className="text-xs text-muted-foreground">
          Types acceptés: {fileTypes.join(', ')} • Taille max: {maxFileSize / (1024 * 1024)}MB
        </p>
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          accept={fileTypes.join(',')}
          onChange={handleChange}
          disabled={files.length >= maxFiles}
        />
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-card rounded-md border">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <FileUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={uploading || files.length === 0}
            >
              {uploading ? 'Téléchargement...' : 'Télécharger les fichiers'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Success message */}
      {uploadComplete && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Téléchargement réussi</AlertTitle>
          <AlertDescription className="text-green-700">
            {uploadedFiles.length} fichier{uploadedFiles.length > 1 ? 's ont' : ' a'} été téléchargé{uploadedFiles.length > 1 ? 's' : ''} avec succès.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
