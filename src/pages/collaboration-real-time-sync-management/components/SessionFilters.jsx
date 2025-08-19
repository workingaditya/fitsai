import React, { useState, useEffect } from 'react';
import { Filter, Calendar, FileText, X } from 'lucide-react';
import collaborationService from '../../../services/collaborationService';

const SessionFilters = ({ filters, onFiltersChange }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const documentsData = await collaborationService?.getDocuments();
      setDocuments(documentsData || []);
    } catch (error) {
      console.error('Failed to load filter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      status: 'all',
      document_id: 'all', 
      date_range: '7d'
    };
    onFiltersChange?.(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.status !== 'all') count++;
    if (filters?.document_id !== 'all') count++;
    if (filters?.date_range !== '7d') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </h4>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
          >
            <X className="w-3 h-3 mr-1" />
            Reset ({activeFilterCount})
          </button>
        )}
      </div>
      <div className="space-y-3">
        {/* Session Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Session Status
          </label>
          <select
            value={filters?.status || 'all'}
            onChange={(e) => handleFilterChange('status', e?.target?.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Document Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            Document
          </label>
          <select
            value={filters?.document_id || 'all'}
            onChange={(e) => handleFilterChange('document_id', e?.target?.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="all">All Documents</option>
            {documents?.map((doc) => (
              <option key={doc?.id} value={doc?.id}>
                {doc?.title_en?.length > 30 
                  ? `${doc?.title_en?.slice(0, 30)}...` 
                  : doc?.title_en || 'Untitled Document'}
              </option>
            ))}
          </select>
          {loading && (
            <p className="text-xs text-gray-500 mt-1">Loading documents...</p>
          )}
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Date Range
          </label>
          <select
            value={filters?.date_range || '7d'}
            onChange={(e) => handleFilterChange('date_range', e?.target?.value)}
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        {/* Quick Filter Buttons */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Quick Filters
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('status', 'active')}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                filters?.status === 'active' ?'bg-green-100 text-green-700 border-green-300' :'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Active Only
            </button>
            
            <button
              onClick={() => {
                handleFilterChange('status', 'all');
                handleFilterChange('date_range', '1d');
              }}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                filters?.date_range === '1d' && filters?.status === 'all' ?'bg-blue-100 text-blue-700 border-blue-300' :'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Today
            </button>

            <button
              onClick={() => {
                handleFilterChange('status', 'error');
                handleFilterChange('date_range', 'all');
              }}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                filters?.status === 'error' ?'bg-red-100 text-red-700 border-red-300' :'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Issues
            </button>
          </div>
        </div>

        {/* Summary Information */}
        <div className="pt-3 border-t border-gray-200">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Filter Summary</h5>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Status: <span className="font-medium capitalize">{filters?.status || 'all'}</span></div>
            <div>Period: <span className="font-medium">{
              filters?.date_range === '1d' ? 'Last 24 hours' :
              filters?.date_range === '7d' ? 'Last 7 days' :
              filters?.date_range === '30d' ? 'Last 30 days' :
              filters?.date_range === '90d'? 'Last 90 days' : 'All time'
            }</span></div>
            {filters?.document_id && filters?.document_id !== 'all' && (
              <div>Document: <span className="font-medium">Specific document selected</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionFilters;