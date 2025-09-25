import React from 'react';
import { Zap, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

export interface SmartScanStatus {
  id: string;
  fileName: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  confidence?: number;
  extractedData?: {
    merchant?: string;
    amount?: number;
    date?: string;
    category?: string;
  };
}

interface SmartScanStatusIndicatorProps {
  scans: SmartScanStatus[];
  isVisible: boolean;
  onDismiss?: (scanId: string) => void;
  className?: string;
}

export function SmartScanStatusIndicator({
  scans,
  isVisible,
  onDismiss,
  className,
}: SmartScanStatusIndicatorProps) {
  if (!isVisible || scans.length === 0) {
    return null;
  }

  const getStatusIcon = (status: SmartScanStatus['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (scan: SmartScanStatus) => {
    switch (scan.status) {
      case 'processing':
        return `Processing... ${scan.progress}%`;
      case 'completed':
        return scan.confidence
          ? `Completed (${Math.round(scan.confidence * 100)}% confidence)`
          : 'Completed';
      case 'failed':
        return 'Processing failed';
    }
  };

  return (
    <div className={cn(
      "fixed top-20 right-4 z-50 w-80 max-h-96 overflow-y-auto",
      "bg-white border border-blue-200 rounded-lg shadow-lg",
      className
    )}>
      <div className="p-4 border-b border-blue-100 bg-blue-50">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">SmartScan Processing</h3>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            {scans.filter(s => s.status === 'processing').length} active
          </span>
        </div>
      </div>

      <div className="p-2 space-y-2 max-h-80 overflow-y-auto">
        {scans.map((scan) => (
          <div
            key={scan.id}
            className={cn(
              "p-3 rounded-lg border transition-all duration-200",
              scan.status === 'processing' && "bg-blue-50 border-blue-200",
              scan.status === 'completed' && "bg-blue-50 border-blue-300",
              scan.status === 'failed' && "bg-red-50 border-red-200"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(scan.status)}
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {scan.fileName}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-1">
                  {getStatusText(scan)}
                </p>

                {/* Progress bar for processing */}
                {scan.status === 'processing' && (
                  <div className="mt-2 w-full bg-blue-100 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${scan.progress}%` }}
                    />
                  </div>
                )}

                {/* Extracted data preview */}
                {scan.status === 'completed' && scan.extractedData && (
                  <div className="mt-2 text-xs text-blue-700">
                    {scan.extractedData.merchant && (
                      <span>{scan.extractedData.merchant}</span>
                    )}
                    {scan.extractedData.amount && (
                      <span className="ml-2">${scan.extractedData.amount}</span>
                    )}
                    {scan.extractedData.category && (
                      <span className="ml-2 text-blue-600">
                        {scan.extractedData.category}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Dismiss button for completed/failed */}
              {(scan.status === 'completed' || scan.status === 'failed') && onDismiss && (
                <button
                  onClick={() => onDismiss(scan.id)}
                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <AlertCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SmartScanStatusIndicator;