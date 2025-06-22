import React, { useState, useCallback } from 'react';
import { Upload, X, Image, Video, File, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import apiService from '../services/api';

interface UploadedFile {
  filename: string;
  originalname: string;
  url: string;
  size: number;
  mimetype: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesUploaded?: (files: UploadedFile[]) => void;
  onFilesChange?: (files: File[]) => void;
  existingFiles?: UploadedFile[];
  className?: string;
  disabled?: boolean;
  uploadText?: string;
  supportedFormats?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept = "image/*,video/*",
  multiple = true,
  maxFiles = 10,
  maxSize = 5, // 5MB default
  onFilesUploaded,
  onFilesChange,
  existingFiles = [],
  className = "",
  disabled = false,
  uploadText = "Drag and drop files here, or click to select",
  supportedFormats = "Images, videos, and documents"
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, [maxFiles, maxSize]);

  const handleFileSelection = (files: File[]) => {
    if (disabled) return;

    // Filter valid files
    const validFiles = files.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${maxSize}MB limit`,
          variant: "destructive"
        });
        return false;
      }

      // Check file count
      if (selectedFiles.length + uploadedFiles.length >= maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive"
        });
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
      setSelectedFiles(newFiles.slice(0, maxFiles - uploadedFiles.length));
      onFilesChange?.(newFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileSelection(files);
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const removeUploadedFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesUploaded?.(newFiles);
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      
      if (multiple) {
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
        
        const response = await apiService.upload('/upload/multiple', formData);
        
        if (response.success) {
          const newUploadedFiles = [...uploadedFiles, ...response.files];
          setUploadedFiles(newUploadedFiles);
          setSelectedFiles([]);
          onFilesUploaded?.(newUploadedFiles);
          
          toast({
            title: "Upload successful",
            description: `${response.files.length} file(s) uploaded successfully`,
          });
        }
      } else {
        formData.append('file', selectedFiles[0]);
        
        const response = await apiService.upload('/upload/single', formData);
        
        if (response.success) {
          const newUploadedFiles = [...uploadedFiles, response.file];
          setUploadedFiles(newUploadedFiles);
          setSelectedFiles([]);
          onFilesUploaded?.(newUploadedFiles);
          
          toast({
            title: "Upload successful",
            description: "File uploaded successfully",
          });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (mimetype.startsWith('video/')) {
      return <Video className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver 
            ? 'border-primary bg-primary/5' 
            : disabled 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className={`h-8 w-8 mx-auto mb-2 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
        <p className={`text-sm mb-2 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {uploadText}
        </p>
        <p className={`text-xs mb-3 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
          {supportedFormats} (Max {maxSize}MB each, {maxFiles} files max)
        </p>
        
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          id="file-upload"
          disabled={disabled}
        />
        
        <label htmlFor="file-upload">
          <Button 
            variant="outline" 
            type="button" 
            disabled={disabled || (selectedFiles.length + uploadedFiles.length >= maxFiles)}
            className="pointer-events-none"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </label>
      </div>

      {/* Selected Files (Not yet uploaded) */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Selected Files ({selectedFiles.length})</h4>
            <Button
              onClick={uploadFiles}
              disabled={uploading || selectedFiles.length === 0}
              size="sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {selectedFiles.length} file(s)
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-2 border rounded-lg bg-blue-50">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSelectedFile(index)}
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploaded Files ({uploadedFiles.length})</h4>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-2 border rounded-lg bg-green-50">
                {getFileIcon(file.mimetype)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.originalname}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View file
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadedFile(index)}
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 