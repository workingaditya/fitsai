import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelSelector = ({ selectedModel, onModelChange, userRole = 'admin' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Enhanced model configurations with GEMINI support
  const modelOptions = [
    // OpenAI Models
    {
      id: 'gpt-4',
      name: 'GPT-4', 
      description: 'Most capable model for complex reasoning',
      category: 'OpenAI',
      icon: 'Zap',
      color: 'bg-blue-500',
      features: ['Reasoning', 'Code', 'Analysis'],
      cost: 'High',
      speed: 'Medium'
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      description: 'Optimized GPT-4 for speed and efficiency',
      category: 'OpenAI',
      icon: 'Zap',
      color: 'bg-blue-600',
      features: ['Fast', 'Multimodal', 'Structured'],
      cost: 'Medium',
      speed: 'Fast'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and cost-effective for most tasks',
      category: 'OpenAI',
      icon: 'Zap',
      color: 'bg-blue-400',
      features: ['Fast', 'General', 'Affordable'],
      cost: 'Low',
      speed: 'Very Fast'
    },
    
    // GEMINI Models
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      description: 'Advanced multimodal AI for video generation',
      category: 'Google Gemini',
      icon: 'Video',
      color: 'bg-purple-500',
      features: ['Video Generation', 'Multimodal', 'Creative'],
      cost: 'Medium',
      speed: 'Medium',
      specialty: 'Video Content'
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      description: 'Fast multimodal AI for quick video scripts',
      category: 'Google Gemini',
      icon: 'Video',
      color: 'bg-purple-400',
      features: ['Fast Video Scripts', 'Streaming', 'Efficient'],
      cost: 'Low',
      speed: 'Very Fast',
      specialty: 'Quick Video Generation'
    },
    {
      id: 'gemini-pro-vision',
      name: 'Gemini Pro Vision',
      description: 'Multimodal AI for image and video analysis',
      category: 'Google Gemini',
      icon: 'Eye',
      color: 'bg-purple-600',
      features: ['Vision', 'Image Analysis', 'Video Planning'],
      cost: 'Medium',
      speed: 'Medium',
      specialty: 'Visual Content'
    },
    
    // Local Models
    {
      id: 'mistral-7b',
      name: 'Mistral 7B',
      description: 'Efficient local model for IT troubleshooting',
      category: 'Local LLM',
      icon: 'Server',
      color: 'bg-green-500',
      features: ['Privacy', 'Local', 'IT Focus'],
      cost: 'Free',
      speed: 'Fast'
    },
    {
      id: 'llama-2-13b',
      name: 'Llama 2 13B',
      description: 'Advanced reasoning for complex problems',
      category: 'Local LLM',
      icon: 'Server',
      color: 'bg-green-600',
      features: ['Advanced', 'Reasoning', 'Open Source'],
      cost: 'Free',
      speed: 'Medium'
    },
    {
      id: 'code-llama-34b',
      name: 'Code Llama 34B',
      description: 'Specialized for code generation and analysis',
      category: 'Local LLM',
      icon: 'Code',
      color: 'bg-green-700',
      features: ['Code Focus', 'DevOps', 'Automation'],
      cost: 'Free',
      speed: 'Slow'
    }
  ];

  const selectedModelData = modelOptions?.find(model => model?.id === selectedModel);
  const groupedModels = modelOptions?.reduce((groups, model) => {
    const category = model?.category;
    if (!groups?.[category]) {
      groups[category] = [];
    }
    groups?.[category]?.push(model);
    return groups;
  }, {});

  const handleModelSelect = (modelId) => {
    onModelChange?.(modelId);
    setIsOpen(false);
  };

  const getCostColor = (cost) => {
    switch (cost) {
      case 'Free': return 'text-green-600 dark:text-green-400';
      case 'Low': return 'text-blue-600 dark:text-blue-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'High': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getSpeedColor = (speed) => {
    switch (speed) {
      case 'Very Fast': return 'text-green-600 dark:text-green-400';
      case 'Fast': return 'text-blue-600 dark:text-blue-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Slow': return 'text-red-600 dark:text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[200px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${selectedModelData?.color || 'bg-gray-400'}`} />
          <span className="font-medium">{selectedModelData?.name || 'Select Model'}</span>
          {selectedModelData?.specialty && (
            <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
              {selectedModelData?.specialty}
            </span>
          )}
        </div>
        <Icon 
          name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="text-muted-foreground" 
        />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-border">
            <h3 className="font-medium text-sm text-card-foreground">Select AI Model</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Choose the best model for your task. Gemini models specialize in video generation.
            </p>
          </div>

          <div className="py-2">
            {Object.entries(groupedModels)?.map(([category, models]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50 border-b border-border/50">
                  {category}
                </div>
                
                <div className="space-y-1 p-2">
                  {models?.map((model) => (
                    <div
                      key={model?.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                        selectedModel === model?.id ? 'bg-accent text-accent-foreground' : ''
                      }`}
                      onClick={() => handleModelSelect(model?.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-8 h-8 rounded-full ${model?.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon name={model?.icon} size={16} className="text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-sm text-card-foreground">
                                {model?.name}
                              </h4>
                              {model?.specialty && (
                                <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded flex-shrink-0">
                                  {model?.specialty}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {model?.description}
                            </p>
                            
                            {/* Features */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {model?.features?.slice(0, 3)?.map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Model Stats */}
                        <div className="flex flex-col items-end text-xs ml-3 flex-shrink-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-muted-foreground">Cost:</span>
                            <span className={`font-medium ${getCostColor(model?.cost)}`}>
                              {model?.cost}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">Speed:</span>
                            <span className={`font-medium ${getSpeedColor(model?.speed)}`}>
                              {model?.speed}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedModel === model?.id && (
                        <div className="flex items-center justify-center mt-2 pt-2 border-t border-border/50">
                          <div className="flex items-center space-x-2 text-xs text-accent">
                            <Icon name="Check" size={12} />
                            <span>Currently Selected</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Video Generation Tip */}
          <div className="p-3 border-t border-border bg-purple-50 dark:bg-purple-950/20">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  💡 Pro Tip for Video Generation
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  Use Gemini models and ask: "Create a how-to video for [your topic]" or "Convert this to a video tutorial"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;