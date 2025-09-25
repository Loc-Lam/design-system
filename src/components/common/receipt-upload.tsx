import { useState, useRef, useCallback } from 'react';
import { Upload, X, Eye, Download, FileText, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

export interface ReceiptFile {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadStatus: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  smartScanData?: {
    merchant?: string;
    amount?: number;
    date?: string;
    category?: string;
    confidence?: number;
  };
  errorMessage?: string;
}

export interface ReceiptUploadProps {
  onUpload?: (files: File[]) => Promise<void>;
  onRemove?: (fileId: string) => void;
  onPreview?: (file: ReceiptFile) => void;
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
  uploadedReceipts?: ReceiptFile[];
  className?: string;
  disabled?: boolean;
}

export function ReceiptUpload({
  onUpload,
  onRemove,
  onPreview,
  maxFiles = 10,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  uploadedReceipts = [],
  className,
  disabled = false,
}: ReceiptUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please upload images or PDFs.`;
    }
    if (file.size > maxSizeBytes) {
      return `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds the limit of ${maxSizeBytes / 1024 / 1024}MB.`;
    }
    if (uploadedReceipts.length >= maxFiles) {
      return `Maximum of ${maxFiles} files allowed.`;
    }
    return null;
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || disabled) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      console.error('File validation errors:', errors);
      // You could show these errors in a toast or alert
      return;
    }

    if (validFiles.length > 0) {
      setIsUploading(true);
      try {
        await onUpload?.(validFiles);
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  }, [onUpload, disabled, uploadedReceipts.length, maxFiles, maxSizeBytes, acceptedTypes]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect, disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: ReceiptFile['uploadStatus']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'completed':
        return <Check className="w-4 h-4 text-blue-600" />;
      case 'error':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Upload className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (receipt: ReceiptFile) => {
    switch (receipt.uploadStatus) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'SmartScanning...';
      case 'completed':
        return receipt.smartScanData ? 'SmartScan completed' : 'Upload completed';
      case 'error':
        return receipt.errorMessage || 'Upload failed';
      default:
        return 'Ready to upload';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {isUploading ? 'Uploading receipts...' : 'Drop receipt files here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                disabled={disabled || isUploading}
                className="text-blue-600 hover:text-blue-700 underline focus:outline-none"
              >
                browse files
              </button>
            </p>
          </div>

          <div className="text-xs text-gray-500">
            <p>Supports: JPEG, PNG, WebP, PDF</p>
            <p>Max size: {maxSizeBytes / 1024 / 1024}MB per file</p>
            <p>Max files: {maxFiles}</p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedReceipts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Receipts ({uploadedReceipts.length})
          </h4>

          <div className="space-y-2">
            {uploadedReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className={cn(
                  'flex items-center space-x-3 p-3 bg-white border rounded-lg',
                  receipt.uploadStatus === 'completed'
                    ? 'border-blue-200 bg-blue-50'
                    : receipt.uploadStatus === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200'
                )}
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {receipt.type.startsWith('image/') ? (
                    <img
                      src={receipt.url}
                      alt={receipt.name}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {receipt.name}
                    </p>
                    {getStatusIcon(receipt.uploadStatus)}
                  </div>

                  <p className="text-xs text-gray-500">
                    {formatFileSize(receipt.size)} • {getStatusText(receipt)}
                  </p>

                  {/* SmartScan Data with OCR Confidence */}
                  {receipt.smartScanData && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-blue-600">
                          {receipt.smartScanData.merchant && `${receipt.smartScanData.merchant} • `}
                          {receipt.smartScanData.amount && `$${receipt.smartScanData.amount} • `}
                          {receipt.smartScanData.date && receipt.smartScanData.date}
                        </div>
                        {receipt.smartScanData.confidence && (
                          <div className="flex items-center space-x-1">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              receipt.smartScanData.confidence >= 0.9 ? "bg-blue-600" :
                              receipt.smartScanData.confidence >= 0.7 ? "bg-blue-400" : "bg-blue-300"
                            )} />
                            <span className="text-xs font-semibold text-blue-700">
                              {Math.round(receipt.smartScanData.confidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Confidence Bar */}
                      {receipt.smartScanData.confidence && (
                        <div className="w-full bg-blue-100 rounded-full h-1">
                          <div
                            className={cn(
                              "h-1 rounded-full transition-all duration-300",
                              receipt.smartScanData.confidence >= 0.9 ? "bg-blue-600" :
                              receipt.smartScanData.confidence >= 0.7 ? "bg-blue-500" : "bg-blue-400"
                            )}
                            style={{ width: `${receipt.smartScanData.confidence * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview?.(receipt)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove?.(receipt.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptUpload;