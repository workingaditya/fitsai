import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ModelDeploymentWizard = ({ isOpen, onClose, onDeploy }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deploymentConfig, setDeploymentConfig] = useState({
    modelType: '',
    modelName: '',
    version: '',
    resourceAllocation: {
      cpu: 4,
      memory: 8,
      gpu: 1
    },
    scaling: {
      minInstances: 1,
      maxInstances: 5,
      autoScale: true
    },
    networking: {
      port: 8080,
      enableSSL: true,
      allowedIPs: []
    },
    monitoring: {
      enableMetrics: true,
      enableLogging: true,
      alertThreshold: 90
    }
  });

  const modelTypeOptions = [
    { value: 'mistral-7b', label: 'Mistral 7B', description: 'General purpose language model' },
    { value: 'llama2-7b', label: 'Llama 2 7B', description: 'Meta\'s conversational AI model' },
    { value: 'codellama-7b', label: 'Code Llama 7B', description: 'Specialized for code generation' },
    { value: 'vicuna-7b', label: 'Vicuna 7B', description: 'Fine-tuned for instruction following' },
    { value: 'alpaca-7b', label: 'Alpaca 7B', description: 'Stanford\'s instruction-tuned model' }
  ];

  const steps = [
    { id: 1, title: 'Model Selection', icon: 'Package' },
    { id: 2, title: 'Resource Configuration', icon: 'HardDrive' },
    { id: 3, title: 'Network & Security', icon: 'Shield' },
    { id: 4, title: 'Monitoring Setup', icon: 'Activity' },
    { id: 5, title: 'Review & Deploy', icon: 'CheckCircle' }
  ];

  const handleInputChange = (section, field, value) => {
    if (section) {
      setDeploymentConfig(prev => ({
        ...prev,
        [section]: {
          ...prev?.[section],
          [field]: value
        }
      }));
    } else {
      setDeploymentConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeploy = () => {
    onDeploy(deploymentConfig);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Select
              label="Model Type"
              options={modelTypeOptions}
              value={deploymentConfig?.modelType}
              onChange={(value) => handleInputChange(null, 'modelType', value)}
              description="Choose the base model architecture"
              required
            />
            <Input
              label="Model Name"
              value={deploymentConfig?.modelName}
              onChange={(e) => handleInputChange(null, 'modelName', e?.target?.value)}
              placeholder="e.g., IT-Support-Assistant"
              description="Unique identifier for this model instance"
              required
            />
            <Input
              label="Version"
              value={deploymentConfig?.version}
              onChange={(e) => handleInputChange(null, 'version', e?.target?.value)}
              placeholder="e.g., 1.0.0"
              description="Version number for tracking"
              required
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="CPU Cores"
                type="number"
                value={deploymentConfig?.resourceAllocation?.cpu}
                onChange={(e) => handleInputChange('resourceAllocation', 'cpu', parseInt(e?.target?.value))}
                min={1}
                max={32}
              />
              <Input
                label="Memory (GB)"
                type="number"
                value={deploymentConfig?.resourceAllocation?.memory}
                onChange={(e) => handleInputChange('resourceAllocation', 'memory', parseInt(e?.target?.value))}
                min={1}
                max={128}
              />
              <Input
                label="GPU Count"
                type="number"
                value={deploymentConfig?.resourceAllocation?.gpu}
                onChange={(e) => handleInputChange('resourceAllocation', 'gpu', parseInt(e?.target?.value))}
                min={0}
                max={8}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Min Instances"
                type="number"
                value={deploymentConfig?.scaling?.minInstances}
                onChange={(e) => handleInputChange('scaling', 'minInstances', parseInt(e?.target?.value))}
                min={1}
                max={10}
              />
              <Input
                label="Max Instances"
                type="number"
                value={deploymentConfig?.scaling?.maxInstances}
                onChange={(e) => handleInputChange('scaling', 'maxInstances', parseInt(e?.target?.value))}
                min={1}
                max={50}
              />
            </div>
            <Checkbox
              label="Enable Auto-scaling"
              description="Automatically scale instances based on demand"
              checked={deploymentConfig?.scaling?.autoScale}
              onChange={(e) => handleInputChange('scaling', 'autoScale', e?.target?.checked)}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Input
              label="Service Port"
              type="number"
              value={deploymentConfig?.networking?.port}
              onChange={(e) => handleInputChange('networking', 'port', parseInt(e?.target?.value))}
              min={1024}
              max={65535}
              description="Port number for the model service"
            />
            <Checkbox
              label="Enable SSL/TLS"
              description="Encrypt all communications with SSL/TLS"
              checked={deploymentConfig?.networking?.enableSSL}
              onChange={(e) => handleInputChange('networking', 'enableSSL', e?.target?.checked)}
            />
            <Input
              label="Allowed IP Ranges"
              value={deploymentConfig?.networking?.allowedIPs?.join(', ')}
              onChange={(e) => handleInputChange('networking', 'allowedIPs', e?.target?.value?.split(', ')?.filter(ip => ip?.trim()))}
              placeholder="192.168.1.0/24, 10.0.0.0/8"
              description="Comma-separated list of allowed IP ranges (leave empty for all)"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Checkbox
              label="Enable Performance Metrics"
              description="Collect detailed performance and usage metrics"
              checked={deploymentConfig?.monitoring?.enableMetrics}
              onChange={(e) => handleInputChange('monitoring', 'enableMetrics', e?.target?.checked)}
            />
            <Checkbox
              label="Enable Request Logging"
              description="Log all requests and responses for debugging"
              checked={deploymentConfig?.monitoring?.enableLogging}
              onChange={(e) => handleInputChange('monitoring', 'enableLogging', e?.target?.checked)}
            />
            <Input
              label="Alert Threshold (%)"
              type="number"
              value={deploymentConfig?.monitoring?.alertThreshold}
              onChange={(e) => handleInputChange('monitoring', 'alertThreshold', parseInt(e?.target?.value))}
              min={50}
              max={100}
              description="CPU/Memory threshold for alerts"
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-card-foreground mb-3">Deployment Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <span className="ml-2 font-medium">{deploymentConfig?.modelType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2 font-medium">{deploymentConfig?.modelName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Resources:</span>
                  <span className="ml-2 font-medium">
                    {deploymentConfig?.resourceAllocation?.cpu}C/{deploymentConfig?.resourceAllocation?.memory}GB
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Scaling:</span>
                  <span className="ml-2 font-medium">
                    {deploymentConfig?.scaling?.minInstances}-{deploymentConfig?.scaling?.maxInstances} instances
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Port:</span>
                  <span className="ml-2 font-medium">{deploymentConfig?.networking?.port}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">SSL:</span>
                  <span className="ml-2 font-medium">
                    {deploymentConfig?.networking?.enableSSL ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                <div>
                  <h5 className="font-medium text-card-foreground">Deployment Notice</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    This deployment will allocate significant system resources. Ensure adequate capacity is available before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Deploy New Model</h2>
            <p className="text-sm text-muted-foreground">Configure and deploy a new LLM instance</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step?.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border text-muted-foreground'
                }`}>
                  {currentStep > step?.id ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step?.id ? 'text-card-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </span>
                {index < steps?.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step?.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep === steps?.length ? (
              <Button
                variant="default"
                onClick={handleDeploy}
                iconName="Rocket"
                iconPosition="left"
              >
                Deploy Model
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleNext}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDeploymentWizard;