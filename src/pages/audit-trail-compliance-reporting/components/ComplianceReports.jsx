import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const ComplianceReports = ({ onGenerateReport, onScheduleReport }) => {
  const [selectedFramework, setSelectedFramework] = useState('');
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-08-01',
    endDate: '2025-08-13'
  });
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: 1,
      name: 'SOC 2 Monthly Report',
      framework: 'SOC 2 Type II',
      frequency: 'Monthly',
      nextRun: '2025-09-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'GDPR Compliance Check',
      framework: 'GDPR',
      frequency: 'Weekly',
      nextRun: '2025-08-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'Security Audit Trail',
      framework: 'ISO 27001',
      frequency: 'Daily',
      nextRun: '2025-08-14',
      status: 'paused'
    }
  ]);

  const frameworkOptions = [
    { value: 'soc2', label: 'SOC 2 Type II' },
    { value: 'gdpr', label: 'GDPR Compliance' },
    { value: 'hipaa', label: 'HIPAA Security' },
    { value: 'iso27001', label: 'ISO 27001' },
    { value: 'pci_dss', label: 'PCI DSS' },
    { value: 'custom', label: 'Custom Framework' }
  ];

  const reportTypeOptions = [
    { value: 'executive_summary', label: 'Executive Summary' },
    { value: 'detailed_audit', label: 'Detailed Audit Report' },
    { value: 'security_events', label: 'Security Events Report' },
    { value: 'access_review', label: 'Access Review Report' },
    { value: 'compliance_gaps', label: 'Compliance Gaps Analysis' },
    { value: 'risk_assessment', label: 'Risk Assessment Report' }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'SOC 2 Q3 2025 Report',
      framework: 'SOC 2 Type II',
      generatedDate: '2025-08-12',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'GDPR Weekly Compliance',
      framework: 'GDPR',
      generatedDate: '2025-08-11',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Security Events Summary',
      framework: 'ISO 27001',
      generatedDate: '2025-08-10',
      status: 'completed',
      size: '3.2 MB'
    },
    {
      id: 4,
      name: 'Access Review Report',
      framework: 'Custom',
      generatedDate: '2025-08-09',
      status: 'failed',
      size: '0 MB'
    }
  ];

  const handleGenerateReport = () => {
    if (selectedFramework && reportType) {
      onGenerateReport({
        framework: selectedFramework,
        type: reportType,
        dateRange
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'active': return 'text-primary';
      case 'failed': return 'text-error';
      case 'paused': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'active': return 'Play';
      case 'failed': return 'XCircle';
      case 'paused': return 'Pause';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Generate Compliance Report</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Compliance Framework"
              placeholder="Select framework..."
              options={frameworkOptions}
              value={selectedFramework}
              onChange={setSelectedFramework}
              required
            />

            <Select
              label="Report Type"
              placeholder="Select report type..."
              options={reportTypeOptions}
              value={reportType}
              onChange={setReportType}
              required
            />
          </div>

          <div className="space-y-4">
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

        <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-border">
          <Button
            onClick={handleGenerateReport}
            disabled={!selectedFramework || !reportType}
          >
            <Icon name="FileText" size={16} className="mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Icon name="Eye" size={16} className="mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Icon name="Calendar" size={16} className="mr-2" />
            Schedule Report
          </Button>
        </div>
      </div>
      {/* Scheduled Reports */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Scheduled Reports</h3>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            New Schedule
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-card-foreground">Report Name</th>
                <th className="p-3 text-left text-sm font-medium text-card-foreground">Framework</th>
                <th className="p-3 text-left text-sm font-medium text-card-foreground">Frequency</th>
                <th className="p-3 text-left text-sm font-medium text-card-foreground">Next Run</th>
                <th className="p-3 text-left text-sm font-medium text-card-foreground">Status</th>
                <th className="p-3 text-left text-sm font-medium text-card-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheduledReports?.map((report) => (
                <tr key={report?.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3">
                    <div className="text-sm font-medium text-card-foreground">{report?.name}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-muted-foreground">{report?.framework}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-muted-foreground">{report?.frequency}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm text-muted-foreground">{report?.nextRun}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getStatusIcon(report?.status)} 
                        size={16} 
                        className={getStatusColor(report?.status)} 
                      />
                      <span className={`text-sm capitalize ${getStatusColor(report?.status)}`}>
                        {report?.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Play" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Recent Reports */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="History" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">Recent Reports</h3>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="Archive" size={16} className="mr-2" />
            View Archive
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentReports?.map((report) => (
            <div key={report?.id} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={16} className="text-primary" />
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getStatusIcon(report?.status)} 
                      size={12} 
                      className={getStatusColor(report?.status)} 
                    />
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Icon name="Download" size={14} />
                </Button>
              </div>
              
              <h4 className="text-sm font-medium text-card-foreground mb-2 line-clamp-2">
                {report?.name}
              </h4>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>{report?.framework}</div>
                <div>{report?.generatedDate}</div>
                <div>{report?.size}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceReports;