import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ onFiltersChange, savedQueries, onSaveQuery, onLoadQuery }) => {
  const [dateRange, setDateRange] = useState({
    startDate: '2025-08-06',
    endDate: '2025-08-13'
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);
  const [complianceFramework, setComplianceFramework] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [outcome, setOutcome] = useState('');
  const [queryName, setQueryName] = useState('');

  const userOptions = [
    { value: 'admin@company.com', label: 'IT Administrator' },
    { value: 'john.doe@company.com', label: 'John Doe' },
    { value: 'jane.smith@company.com', label: 'Jane Smith' },
    { value: 'security@company.com', label: 'Security Officer' },
    { value: 'compliance@company.com', label: 'Compliance Manager' }
  ];

  const actionOptions = [
    { value: 'login', label: 'User Login' },
    { value: 'logout', label: 'User Logout' },
    { value: 'config_change', label: 'Configuration Change' },
    { value: 'data_access', label: 'Data Access' },
    { value: 'permission_change', label: 'Permission Change' },
    { value: 'system_admin', label: 'System Administration' },
    { value: 'security_event', label: 'Security Event' },
    { value: 'compliance_check', label: 'Compliance Check' }
  ];

  const complianceOptions = [
    { value: '', label: 'All Frameworks' },
    { value: 'soc2', label: 'SOC 2 Type II' },
    { value: 'gdpr', label: 'GDPR Compliance' },
    { value: 'hipaa', label: 'HIPAA Security' },
    { value: 'iso27001', label: 'ISO 27001' },
    { value: 'pci_dss', label: 'PCI DSS' }
  ];

  const outcomeOptions = [
    { value: '', label: 'All Outcomes' },
    { value: 'success', label: 'Success' },
    { value: 'failure', label: 'Failure' },
    { value: 'warning', label: 'Warning' },
    { value: 'blocked', label: 'Blocked' }
  ];

  const handleApplyFilters = () => {
    const filters = {
      dateRange,
      users: selectedUsers,
      actions: selectedActions,
      complianceFramework,
      ipAddress,
      outcome
    };
    onFiltersChange(filters);
  };

  const handleResetFilters = () => {
    setDateRange({ startDate: '2025-08-06', endDate: '2025-08-13' });
    setSelectedUsers([]);
    setSelectedActions([]);
    setComplianceFramework('');
    setIpAddress('');
    setOutcome('');
    onFiltersChange({
      dateRange: { startDate: '2025-08-06', endDate: '2025-08-13' },
      users: [],
      actions: [],
      complianceFramework: '',
      ipAddress: '',
      outcome: ''
    });
  };

  const handleSaveQuery = () => {
    if (queryName?.trim()) {
      const query = {
        name: queryName,
        filters: {
          dateRange,
          users: selectedUsers,
          actions: selectedActions,
          complianceFramework,
          ipAddress,
          outcome
        }
      };
      onSaveQuery(query);
      setQueryName('');
    }
  };

  return (
    <div className="w-full h-full bg-card border-r border-border overflow-y-auto scrollbar-thin">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Filter" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Audit Filters</h2>
        </div>
        
        {/* Saved Queries */}
        <div className="mb-6">
          <label className="text-sm font-medium text-card-foreground mb-2 block">
            Saved Queries
          </label>
          <Select
            placeholder="Load saved query..."
            options={savedQueries?.map(q => ({ value: q?.id, label: q?.name }))}
            value=""
            onChange={(value) => {
              const query = savedQueries?.find(q => q?.id === value);
              if (query) onLoadQuery(query);
            }}
            className="mb-3"
          />
          <div className="flex space-x-2">
            <Input
              placeholder="Query name..."
              value={queryName}
              onChange={(e) => setQueryName(e?.target?.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveQuery}
              disabled={!queryName?.trim()}
            >
              <Icon name="Save" size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Date Range */}
        <div>
          <label className="text-sm font-medium text-card-foreground mb-3 block">
            Date Range
          </label>
          <div className="space-y-3">
            <Input
              label="Start Date"
              type="date"
              value={dateRange?.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e?.target?.value }))}
            />
            <Input
              label="End Date"
              type="date"
              value={dateRange?.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e?.target?.value }))}
            />
          </div>
        </div>

        {/* Users */}
        <div>
          <Select
            label="Users"
            placeholder="Select users..."
            options={userOptions}
            value={selectedUsers}
            onChange={setSelectedUsers}
            multiple
            searchable
            clearable
          />
        </div>

        {/* Actions */}
        <div>
          <Select
            label="Action Types"
            placeholder="Select actions..."
            options={actionOptions}
            value={selectedActions}
            onChange={setSelectedActions}
            multiple
            searchable
            clearable
          />
        </div>

        {/* Compliance Framework */}
        <div>
          <Select
            label="Compliance Framework"
            options={complianceOptions}
            value={complianceFramework}
            onChange={setComplianceFramework}
          />
        </div>

        {/* IP Address */}
        <div>
          <Input
            label="IP Address"
            placeholder="192.168.1.1 or 10.0.0.0/24"
            value={ipAddress}
            onChange={(e) => setIpAddress(e?.target?.value)}
          />
        </div>

        {/* Outcome */}
        <div>
          <Select
            label="Outcome"
            options={outcomeOptions}
            value={outcome}
            onChange={setOutcome}
          />
        </div>

        {/* Quick Filters */}
        <div>
          <label className="text-sm font-medium text-card-foreground mb-3 block">
            Quick Filters
          </label>
          <div className="space-y-2">
            <Checkbox
              label="Failed login attempts"
              onChange={(e) => {
                if (e?.target?.checked) {
                  setSelectedActions(['login']);
                  setOutcome('failure');
                }
              }}
            />
            <Checkbox
              label="Administrative changes"
              onChange={(e) => {
                if (e?.target?.checked) {
                  setSelectedActions(['config_change', 'permission_change', 'system_admin']);
                }
              }}
            />
            <Checkbox
              label="Security events"
              onChange={(e) => {
                if (e?.target?.checked) {
                  setSelectedActions(['security_event']);
                }
              }}
            />
            <Checkbox
              label="Last 24 hours"
              onChange={(e) => {
                if (e?.target?.checked) {
                  const yesterday = new Date();
                  yesterday?.setDate(yesterday?.getDate() - 1);
                  setDateRange({
                    startDate: yesterday?.toISOString()?.split('T')?.[0],
                    endDate: new Date()?.toISOString()?.split('T')?.[0]
                  });
                }
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 pt-4 border-t border-border">
          <Button onClick={handleApplyFilters} className="w-full">
            <Icon name="Search" size={16} className="mr-2" />
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters} className="w-full">
            <Icon name="RotateCcw" size={16} className="mr-2" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;