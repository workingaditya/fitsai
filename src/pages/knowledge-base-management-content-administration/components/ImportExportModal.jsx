import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ImportExportModal = ({ isOpen, onClose, mode = 'import' }) => {
  const [selectedFormat, setSelectedFormat] = useState('');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeVersions, setIncludeVersions] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const formatOptions = [
    { value: 'json', label: 'JSON Format' },
    { value: 'xml', label: 'XML Format' },
    { value: 'csv', label: 'CSV (Metadata Only)' },
    { value: 'pdf', label: 'PDF Compilation' },
    { value: 'docx', label: 'Word Document' },
    { value: 'confluence', label: 'Confluence Export' },
    { value: 'sharepoint', label: 'SharePoint Format' }
  ];

  const categoryOptions = [
    { value: 'network', label: 'Network Troubleshooting' },
    { value: 'security', label: 'Security Procedures' },
    { value: 'system', label: 'System Administration' },
    { value: 'compliance', label: 'Compliance & Policies' }
  ];

  const handleProcess = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          onClose();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const renderImportContent = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <Icon name="Upload" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h4 className="font-medium text-card-foreground mb-2">
          Drop files here or click to browse
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Supports JSON, XML, CSV, and Word documents
        </p>
        <Button variant="outline" size="sm">
          <Icon name="FolderOpen" size={14} className="mr-1" />
          Choose Files
        </Button>
      </div>
      
      <Select
        label="Import Format"
        options={formatOptions?.slice(0, 4)}
        value={selectedFormat}
        onChange={setSelectedFormat}
        placeholder="Select format..."
      />
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-card-foreground">Import Options</label>
        <div className="space-y-2">
          <Checkbox
            label="Import metadata and tags"
            checked={includeMetadata}
            onChange={(e) => setIncludeMetadata(e?.target?.checked)}
          />
          <Checkbox
            label="Import version history"
            checked={includeVersions}
            onChange={(e) => setIncludeVersions(e?.target?.checked)}
          />
          <Checkbox
            label="Overwrite existing articles"
           
          />
          <Checkbox
            label="Create backup before import"
            checked
          />
        </div>
      </div>
      
      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-accent">Import Guidelines</p>
            <ul className="text-muted-foreground mt-1 space-y-1">
              <li>• Maximum file size: 50MB</li>
              <li>• Batch limit: 500 articles</li>
              <li>• Duplicate titles will be renamed automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportContent = () => (
    <div className="space-y-6">
      <Select
        label="Export Format"
        options={formatOptions}
        value={selectedFormat}
        onChange={setSelectedFormat}
        placeholder="Select format..."
      />
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-card-foreground">Categories to Export</label>
        <div className="space-y-2">
          {categoryOptions?.map((category) => (
            <Checkbox
              key={category?.value}
              label={category?.label}
              checked={selectedCategories?.includes(category?.value)}
              onChange={(e) => {
                if (e?.target?.checked) {
                  setSelectedCategories([...selectedCategories, category?.value]);
                } else {
                  setSelectedCategories(selectedCategories?.filter(c => c !== category?.value));
                }
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-card-foreground">Export Options</label>
        <div className="space-y-2">
          <Checkbox
            label="Include metadata and tags"
            checked={includeMetadata}
            onChange={(e) => setIncludeMetadata(e?.target?.checked)}
          />
          <Checkbox
            label="Include version history"
            checked={includeVersions}
            onChange={(e) => setIncludeVersions(e?.target?.checked)}
          />
          <Checkbox
            label="Include analytics data"
           
          />
          <Checkbox
            label="Generate table of contents"
            checked
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-lg font-semibold text-card-foreground">1,247</p>
          <p className="text-xs text-muted-foreground">Total Articles</p>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-lg font-semibold text-card-foreground">156</p>
          <p className="text-xs text-muted-foreground">Selected</p>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-lg font-semibold text-card-foreground">~45MB</p>
          <p className="text-xs text-muted-foreground">Est. Size</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Icon name={mode === 'import' ? 'Download' : 'Upload'} size={20} className="text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">
                {mode === 'import' ? 'Import Knowledge Base' : 'Export Knowledge Base'}
              </h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={16} />
            </Button>
          </div>
          
          {isProcessing ? (
            <div className="space-y-4">
              <div className="text-center">
                <Icon name="Loader2" size={32} className="text-primary mx-auto mb-4 animate-spin" />
                <h4 className="font-medium text-card-foreground mb-2">
                  {mode === 'import' ? 'Importing Articles...' : 'Exporting Articles...'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Please wait while we process your request
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-card-foreground">{progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {mode === 'import' ? renderImportContent() : renderExportContent()}
              
              <div className="flex items-center justify-end space-x-3 mt-8">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleProcess}
                  disabled={!selectedFormat}
                >
                  <Icon name={mode === 'import' ? 'Download' : 'Upload'} size={14} className="mr-1" />
                  {mode === 'import' ? 'Start Import' : 'Start Export'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;