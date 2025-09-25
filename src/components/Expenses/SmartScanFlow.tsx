import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Upload, Scan, CheckCircle, AlertCircle, Camera, File, ZoomIn, ZoomOut, RotateCw, Eye, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { Modal } from '@/components/common/modal';
import { ReceiptUpload, type ReceiptFile } from '@/components/common/receipt-upload';

// SmartScan Flow Component based on Figma design
// Shows the complete 6-screen workflow for SmartScan & OCR processing

interface SmartScanFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (extractedData: any) => void;
}

type FlowStep = 'upload' | 'processing' | 'review' | 'categorize' | 'confirm' | 'complete';

interface ExtractedData {
  merchant: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  confidence: number;
}

export function SmartScanFlow({ isOpen, onClose, onComplete }: SmartScanFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [uploadedReceipts, setUploadedReceipts] = useState<ReceiptFile[]>([]);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Image viewing and editing state
  const [imageZoom, setImageZoom] = useState(100);
  const [imageRotation, setImageRotation] = useState(0);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExtractedData | null>(null);

  const steps: FlowStep[] = ['upload', 'processing', 'review', 'categorize', 'confirm', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);

  const mockExtractedData: ExtractedData = {
    merchant: 'Starbucks Coffee',
    amount: 12.50,
    date: '2024-05-20',
    category: 'Meals & Entertainment',
    description: 'Coffee meeting with client',
    confidence: 0.95
  };

  const handleFileUpload = async (files: File[]) => {
    const newReceipts: ReceiptFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadStatus: 'uploading' as const,
    }));

    setUploadedReceipts(newReceipts);
    setIsProcessing(true);
    setCurrentStep('processing');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    setExtractedData(mockExtractedData);
    setFormData(mockExtractedData);
    setIsProcessing(false);
    setCurrentStep('review');
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const handleComplete = () => {
    if (formData || extractedData) {
      onComplete?.(formData || extractedData);
    }
    onClose();
    // Reset flow
    setCurrentStep('upload');
    setUploadedReceipts([]);
    setExtractedData(null);
    setFormData(null);
    setImageZoom(100);
    setImageRotation(0);
    setShowImagePreview(false);
    setEditingField(null);
  };

  // Image manipulation handlers
  const handleZoomIn = () => setImageZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setImageZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setImageRotation(prev => (prev + 90) % 360);
  const handleTogglePreview = () => setShowImagePreview(!showImagePreview);

  // Form editing handlers
  const handleFieldEdit = (field: string) => {
    setEditingField(editingField === field ? null : field);
  };

  const handleFieldChange = (field: keyof ExtractedData, value: string | number) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              index <= currentStepIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500'
            )}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-12 h-0.5 mx-2',
                index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Receipt</h3>
        <p className="text-gray-600">
          Take a photo or upload an image of your receipt to get started with SmartScan
        </p>
      </div>

      <ReceiptUpload
        onUpload={handleFileUpload}
        uploadedReceipts={uploadedReceipts}
        maxFiles={1}
      />
    </div>
  );

  const renderProcessingStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">SmartScan Processing</h3>
        <p className="text-gray-600">
          Our AI is analyzing your receipt and extracting key information...
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Scan className="w-6 h-6 text-blue-600 animate-pulse" />
          <div>
            <h4 className="font-medium text-blue-900">OCR Analysis in Progress</h4>
            <p className="text-sm text-blue-700">
              Extracting merchant, amount, date, and other details...
            </p>
          </div>
        </div>
      </div>

      {uploadedReceipts.length > 0 && (
        <div className="space-y-4">
          {/* Receipt Image with Controls */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Receipt Preview</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="p-1.5"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">{imageZoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="p-1.5"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  className="p-1.5"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTogglePreview}
                  className="p-1.5"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center overflow-hidden rounded-lg bg-gray-50">
              <img
                src={uploadedReceipts[0].url}
                alt="Processing receipt"
                className="max-h-64 transition-transform duration-200"
                style={{
                  transform: `scale(${imageZoom / 100}) rotate(${imageRotation}deg)`,
                  transformOrigin: 'center'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Edit Extracted Data</h3>
        <p className="text-gray-600">
          Please review and edit the information we extracted from your receipt
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receipt Image Preview */}
        {uploadedReceipts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Receipt Image</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="p-1.5"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">{imageZoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="p-1.5"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  className="p-1.5"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-center overflow-hidden rounded-lg bg-gray-50">
              <img
                src={uploadedReceipts[0].url}
                alt="Receipt for review"
                className="max-h-80 cursor-zoom-in transition-transform duration-200"
                style={{
                  transform: `scale(${imageZoom / 100}) rotate(${imageRotation}deg)`,
                  transformOrigin: 'center'
                }}
                onClick={handleTogglePreview}
              />
            </div>
          </div>
        )}

        {/* Editable Form Data */}
        {(formData || extractedData) && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Extracted Information</h4>
              <div className="flex items-center text-sm text-blue-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                {Math.round((formData?.confidence || extractedData?.confidence || 0) * 100)}% confidence
              </div>
            </div>

            <div className="space-y-4">
              {/* Merchant Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Merchant</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldEdit('merchant')}
                    className="p-1"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                <input
                  type="text"
                  value={formData?.merchant || extractedData?.merchant || ''}
                  onChange={(e) => handleFieldChange('merchant', e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors",
                    editingField === 'merchant' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  )}
                  placeholder="Enter merchant name"
                />
              </div>

              {/* Amount Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldEdit('amount')}
                    className="p-1"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData?.amount || extractedData?.amount || ''}
                  onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value) || 0)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors",
                    editingField === 'amount' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  )}
                  placeholder="0.00"
                />
              </div>

              {/* Date Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldEdit('date')}
                    className="p-1"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                <input
                  type="date"
                  value={formData?.date || extractedData?.date || ''}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors",
                    editingField === 'date' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  )}
                />
              </div>

              {/* Category Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldEdit('category')}
                    className="p-1"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                <select
                  value={formData?.category || extractedData?.category || ''}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors",
                    editingField === 'category' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  )}
                >
                  <option value="Meals & Entertainment">Meals & Entertainment</option>
                  <option value="Travel">Travel</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Software">Software</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Accommodation">Accommodation</option>
                </select>
              </div>

              {/* Description Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldEdit('description')}
                    className="p-1"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                <textarea
                  rows={3}
                  value={formData?.description || extractedData?.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors",
                    editingField === 'description' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  )}
                  placeholder="Add expense description"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OCR Confidence Indicator */}
      {(formData || extractedData) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-blue-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>OCR processing completed with high accuracy</span>
            </div>
            <div className="text-sm font-medium text-blue-600">
              {Math.round((formData?.confidence || extractedData?.confidence || 0) * 100)}% confidence
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCategorizeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <File className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Categorize Expense</h3>
        <p className="text-gray-600">
          Choose the appropriate category and add any additional details
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Meals & Entertainment',
                'Travel',
                'Office Supplies',
                'Software & Services',
                'Marketing',
                'Equipment'
              ].map((category) => (
                <button
                  key={category}
                  className={cn(
                    'p-3 text-left rounded-lg border transition-colors',
                    category === extractedData?.category
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Optional)</label>
            <input
              type="text"
              placeholder="Add tags separated by commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              rows={3}
              placeholder="Add any additional notes about this expense"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Expense</h3>
        <p className="text-gray-600">
          Review your expense details before submitting
        </p>
      </div>

      {extractedData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-semibold text-gray-900">Expense Summary</span>
              <span className="text-2xl font-bold text-blue-600">${extractedData.amount.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Merchant:</span>
                <p className="font-medium">{extractedData.merchant}</p>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <p className="font-medium">{extractedData.date}</p>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <p className="font-medium">{extractedData.category}</p>
              </div>
              <div>
                <span className="text-gray-600">OCR Confidence:</span>
                <p className="font-medium text-green-600">{Math.round(extractedData.confidence * 100)}%</p>
              </div>
            </div>

            <div>
              <span className="text-gray-600 text-sm">Description:</span>
              <p className="font-medium">{extractedData.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-blue-600" />
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Expense Created Successfully!</h3>
        <p className="text-gray-600 mb-6">
          Your expense has been processed and added to your expense report.
        </p>

        {(formData || extractedData) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              <strong>{(formData || extractedData)?.merchant}</strong> - ${((formData || extractedData)?.amount || 0).toFixed(2)}
            </p>
            <p className="text-sm text-blue-600">
              Processed with {Math.round(((formData || extractedData)?.confidence || 0) * 100)}% confidence
            </p>
          </div>
        )}

        <Button onClick={handleComplete} className="w-full">
          Done
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return renderUploadStep();
      case 'processing':
        return renderProcessingStep();
      case 'review':
        return renderReviewStep();
      case 'categorize':
        return renderCategorizeStep();
      case 'confirm':
        return renderConfirmStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderUploadStep();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="SmartScan & OCR Flow"
        size="xl"
      >
        <div className="p-6">
          {renderStepIndicator()}

          <div className="min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {currentStep !== 'complete' && currentStep !== 'processing' && (
            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentStep === 'upload' && uploadedReceipts.length === 0}
              >
                {currentStep === 'confirm' ? 'Create Expense' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Full-Screen Image Preview Modal */}
      {showImagePreview && uploadedReceipts.length > 0 && (
        <Modal
          isOpen={showImagePreview}
          onClose={() => setShowImagePreview(false)}
          title="Receipt Preview"
          size="full"
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Receipt Image</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="flex items-center gap-2"
                >
                  <ZoomOut className="w-4 h-4" />
                  Zoom Out
                </Button>
                <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-md">
                  {imageZoom}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="flex items-center gap-2"
                >
                  <ZoomIn className="w-4 h-4" />
                  Zoom In
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  className="flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImagePreview(false)}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-50 rounded-lg">
              <img
                src={uploadedReceipts[0].url}
                alt="Full-screen receipt preview"
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${imageZoom / 100}) rotate(${imageRotation}deg)`,
                  transformOrigin: 'center'
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default SmartScanFlow;