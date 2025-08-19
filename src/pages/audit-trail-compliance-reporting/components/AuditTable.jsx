import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuditTable = ({ auditLogs, onExport, onViewDetails, userRole }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 25;

  const sortedLogs = useMemo(() => {
    const sortableLogs = [...auditLogs];
    if (sortConfig?.key) {
      sortableLogs?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLogs;
  }, [auditLogs, sortConfig]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * logsPerPage;
    return sortedLogs?.slice(startIndex, startIndex + logsPerPage);
  }, [sortedLogs, currentPage]);

  const totalPages = Math.ceil(sortedLogs?.length / logsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLogs(paginatedLogs?.map(log => log?.id));
    } else {
      setSelectedLogs([]);
    }
  };

  const handleSelectLog = (logId, checked) => {
    if (checked) {
      setSelectedLogs(prev => [...prev, logId]);
    } else {
      setSelectedLogs(prev => prev?.filter(id => id !== logId));
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'success': return 'CheckCircle';
      case 'failure': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      case 'blocked': return 'Shield';
      default: return 'Circle';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'success': return 'text-success';
      case 'failure': return 'text-error';
      case 'warning': return 'text-warning';
      case 'blocked': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskLevel = (action, outcome) => {
    if (outcome === 'failure' && ['login', 'permission_change']?.includes(action)) return 'high';
    if (action === 'security_event') return 'high';
    if (['config_change', 'system_admin']?.includes(action)) return 'medium';
    return 'low';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-error/10 text-error border-error/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const canViewSensitiveData = userRole === 'admin' || userRole === 'compliance';

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Table Header Actions */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {sortedLogs?.length} audit entries
            </span>
            {selectedLogs?.length > 0 && (
              <span className="text-sm text-primary">
                {selectedLogs?.length} selected
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {selectedLogs?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport(selectedLogs)}
              >
                <Icon name="Download" size={16} className="mr-2" />
                Export Selected
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('all')}
            >
              <Icon name="FileText" size={16} className="mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedLogs?.length === paginatedLogs?.length && paginatedLogs?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-1 text-sm font-medium text-card-foreground hover:text-primary"
                >
                  <span>Timestamp</span>
                  <Icon 
                    name={sortConfig?.key === 'timestamp' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('user')}
                  className="flex items-center space-x-1 text-sm font-medium text-card-foreground hover:text-primary"
                >
                  <span>User</span>
                  <Icon 
                    name={sortConfig?.key === 'user' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('action')}
                  className="flex items-center space-x-1 text-sm font-medium text-card-foreground hover:text-primary"
                >
                  <span>Action</span>
                  <Icon 
                    name={sortConfig?.key === 'action' && sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-card-foreground">Resource</th>
              <th className="p-3 text-left text-sm font-medium text-card-foreground">IP Address</th>
              <th className="p-3 text-left text-sm font-medium text-card-foreground">Outcome</th>
              <th className="p-3 text-left text-sm font-medium text-card-foreground">Risk</th>
              <th className="p-3 text-left text-sm font-medium text-card-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs?.map((log, index) => (
              <tr 
                key={log?.id} 
                className={`border-b border-border hover:bg-muted/30 ${
                  selectedLogs?.includes(log?.id) ? 'bg-primary/5' : ''
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedLogs?.includes(log?.id)}
                    onChange={(e) => handleSelectLog(log?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="p-3">
                  <div className="text-sm text-card-foreground font-mono">
                    {formatTimestamp(log?.timestamp)}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={14} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-card-foreground">
                        {canViewSensitiveData ? log?.user : log?.user?.split('@')?.[0] + '@***'}
                      </div>
                      <div className="text-xs text-muted-foreground">{log?.role}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={log?.actionIcon} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-card-foreground">{log?.actionLabel}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm text-card-foreground max-w-xs truncate" title={log?.resource}>
                    {log?.resource}
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm font-mono text-card-foreground">
                    {canViewSensitiveData ? log?.ipAddress : log?.ipAddress?.split('.')?.slice(0, 2)?.join('.') + '.***'}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getOutcomeIcon(log?.outcome)} 
                      size={16} 
                      className={getOutcomeColor(log?.outcome)} 
                    />
                    <span className={`text-sm capitalize ${getOutcomeColor(log?.outcome)}`}>
                      {log?.outcome}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    getRiskColor(getRiskLevel(log?.action, log?.outcome))
                  }`}>
                    {getRiskLevel(log?.action, log?.outcome)}
                  </span>
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(log)}
                  >
                    <Icon name="Eye" size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * logsPerPage) + 1} to {Math.min(currentPage * logsPerPage, sortedLogs?.length)} of {sortedLogs?.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={16} />
              </Button>
              <span className="text-sm text-card-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTable;