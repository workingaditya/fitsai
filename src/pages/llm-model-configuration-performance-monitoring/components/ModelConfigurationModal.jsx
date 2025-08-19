import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ModelConfigurationModal = ({ model, isOpen, onClose, onSave }) => {
  const [config, setConfig] = useState({
    maxTokens: model?.maxTokens || 2048,
    temperature: model?.temperature || 0.7,
    topP: model?.topP || 0.9,
    topK: model?.topK || 40,
    repetitionPenalty: model?.repetitionPenalty || 1.1,
    memoryLimit: model?.memoryLimit || 8,
    maxConcurrentUsers: model?.maxConcurrentUsers || 50,
    enableLogging: model?.enableLogging || true,
    enableCaching: model?.enableCaching || true,
    autoScale: model?.autoScale || false,
    priority: model?.priority || 'medium'
  });

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'critical', label: 'Critical Priority' }
  ];

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(model?.id, config);
    onClose();
  };

  if (!isOpen || !model) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Configure {model?.name}</h2>
              <p className="text-sm text-muted-foreground">Adjust model parameters and settings</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin">
          <div className="space-y-6">
            {/* Generation Parameters */}
            <div>
              <h3 className="text-sm font-medium text-card-foreground mb-4 flex items-center">
                <Icon name="Sliders" size={16} className="mr-2" />
                Generation Parameters
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Max Tokens"
                  type="number"
                  value={config?.maxTokens}
                  onChange={(e) => handleInputChange('maxTokens', parseInt(e?.target?.value))}
                  description="Maximum number of tokens to generate"
                  min={1}
                  max={8192}
                />
                <Input
                  label="Temperature"
                  type="number"
                  value={config?.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e?.target?.value))}
                  description="Controls randomness (0.0-2.0)"
                  min={0}
                  max={2}
                  step={0.1}
                />
                <Input
                  label="Top P"
                  type="number"
                  value={config?.topP}
                  onChange={(e) => handleInputChange('topP', parseFloat(e?.target?.value))}
                  description="Nucleus sampling parameter"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <Input
                  label="Top K"
                  type="number"
                  value={config?.topK}
                  onChange={(e) => handleInputChange('topK', parseInt(e?.target?.value))}
                  description="Top-k sampling parameter"
                  min={1}
                  max={100}
                />
                <Input
                  label="Repetition Penalty"
                  type="number"
                  value={config?.repetitionPenalty}
                  onChange={(e) => handleInputChange('repetitionPenalty', parseFloat(e?.target?.value))}
                  description="Penalty for repetitive text"
                  min={0.5}
                  max={2}
                  step={0.1}
                />
                <Select
                  label="Priority Level"
                  options={priorityOptions}
                  value={config?.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                  description="Model execution priority"
                />
              </div>
            </div>

            {/* Resource Allocation */}
            <div>
              <h3 className="text-sm font-medium text-card-foreground mb-4 flex items-center">
                <Icon name="HardDrive" size={16} className="mr-2" />
                Resource Allocation
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Memory Limit (GB)"
                  type="number"
                  value={config?.memoryLimit}
                  onChange={(e) => handleInputChange('memoryLimit', parseInt(e?.target?.value))}
                  description="Maximum memory allocation"
                  min={1}
                  max={64}
                />
                <Input
                  label="Max Concurrent Users"
                  type="number"
                  value={config?.maxConcurrentUsers}
                  onChange={(e) => handleInputChange('maxConcurrentUsers', parseInt(e?.target?.value))}
                  description="Maximum simultaneous users"
                  min={1}
                  max={500}
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <h3 className="text-sm font-medium text-card-foreground mb-4 flex items-center">
                <Icon name="Cog" size={16} className="mr-2" />
                Advanced Settings
              </h3>
              <div className="space-y-4">
                <Checkbox
                  label="Enable Request Logging"
                  description="Log all requests and responses for debugging"
                  checked={config?.enableLogging}
                  onChange={(e) => handleInputChange('enableLogging', e?.target?.checked)}
                />
                <Checkbox
                  label="Enable Response Caching"
                  description="Cache responses to improve performance"
                  checked={config?.enableCaching}
                  onChange={(e) => handleInputChange('enableCaching', e?.target?.checked)}
                />
                <Checkbox
                  label="Auto-scaling"
                  description="Automatically scale resources based on demand"
                  checked={config?.autoScale}
                  onChange={(e) => handleInputChange('autoScale', e?.target?.checked)}
                />
              </div>
            </div>

            {/* Current Performance Metrics */}
            <div>
              <h3 className="text-sm font-medium text-card-foreground mb-4 flex items-center">
                <Icon name="BarChart3" size={16} className="mr-2" />
                Current Performance
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Response</p>
                  <p className="text-lg font-semibold text-card-foreground">{model?.responseTime}ms</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Accuracy</p>
                  <p className="text-lg font-semibold text-card-foreground">{model?.accuracy}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Uptime</p>
                  <p className="text-lg font-semibold text-card-foreground">99.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelConfigurationModal;