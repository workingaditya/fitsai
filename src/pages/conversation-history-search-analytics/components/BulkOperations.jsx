import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkOperations = ({ 
  selectedConversations, 
  onBulkArchive, 
  onBulkExport, 
  onBulkDelete,
  onCreateKnowledgeArticle,
  userRole 
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const exportFormatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'json', label: 'JSON Export' },
    { value: 'docx', label: 'Word Document' }
  ];

  const handleExport = () => {
    onBulkExport(selectedConversations, exportFormat);
    setShowExportOptions(false);
  };

  const handleDelete = () => {
    onBulkDelete(selectedConversations);
    setShowDeleteConfirm(false);
  };

  if (selectedConversations?.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-gray-900">
              {selectedConversations?.length} conversation{selectedConversations?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Archive */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkArchive(selectedConversations)}
            iconName="Archive"
            iconPosition="left"
          >
            Archive
          </Button>

          {/* Export */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportOptions(!showExportOptions)}
              iconName="Download"
              iconPosition="left"
            >
              Export
              <Icon name="ChevronDown" size={14} className="ml-1" />
            </Button>

            {showExportOptions && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Export Options</h4>
                  <Select
                    label="Format"
                    options={exportFormatOptions}
                    value={exportFormat}
                    onChange={setExportFormat}
                    className="mb-4"
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleExport}
                      className="flex-1"
                    >
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExportOptions(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Create Knowledge Article */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreateKnowledgeArticle(selectedConversations)}
            iconName="BookOpen"
            iconPosition="left"
            disabled={selectedConversations?.length !== 1}
            title={selectedConversations?.length !== 1 ? 'Select exactly one conversation to create knowledge article' : ''}
          >
            Create Article
          </Button>

          {/* Delete (Admin only) */}
          {userRole === 'admin' && (
            <div className="relative">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete
              </Button>

              {showDeleteConfirm && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Icon name="AlertTriangle" size={20} className="text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Confirm Deletion</h4>
                        <p className="text-sm text-gray-600">
                          This action cannot be undone. This will permanently delete {selectedConversations?.length} conversation{selectedConversations?.length !== 1 ? 's' : ''}.
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        className="flex-1"
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Quick actions:</span>
            <button 
              onClick={() => onBulkArchive(selectedConversations)}
              className="text-primary hover:text-primary-dark font-medium"
            >
              Archive all resolved
            </button>
            <button 
              onClick={() => onBulkExport(selectedConversations, 'pdf')}
              className="text-primary hover:text-primary-dark font-medium"
            >
              Export as PDF
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {new Date()?.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
      {/* Click outside handlers */}
      {(showExportOptions || showDeleteConfirm) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowExportOptions(false);
            setShowDeleteConfirm(false);
          }}
        />
      )}
    </div>
  );
};

export default BulkOperations;