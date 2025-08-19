import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { integrationStatusService } from '../../../services/integrationStatusService';

const IntegrationTestModal = ({ service, onClose, onTestComplete }) => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [testSteps, setTestSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const generateTestSteps = (service) => {
    const steps = [
      {
        id: 'connectivity',
        name: 'Connectivity Check',
        description: 'Testing network connectivity to service endpoint',
        duration: 2000
      },
      {
        id: 'authentication',
        name: 'Authentication',
        description: 'Verifying authentication credentials and permissions',
        duration: 1500
      },
      {
        id: 'health_check',
        name: 'Health Check',
        description: 'Running service health diagnostics',
        duration: 3000
      },
      {
        id: 'performance',
        name: 'Performance Test',
        description: 'Measuring response time and throughput',
        duration: 2500
      }
    ];

    // Customize steps based on service type
    if (service?.service_type === 'websocket') {
      steps?.push({
        id: 'websocket',
        name: 'WebSocket Test',
        description: 'Testing WebSocket connection and message handling',
        duration: 2000
      });
    }

    if (service?.service_type === 'llm' || service?.service_type === 'ai') {
      steps?.push({
        id: 'ai_inference',
        name: 'AI Inference Test',
        description: 'Testing model inference and response quality',
        duration: 4000
      });
    }

    if (service?.service_type === 'vector' || service?.service_type === 'search') {
      steps?.push({
        id: 'search_query',
        name: 'Search Query Test',
        description: 'Testing search functionality and result accuracy',
        duration: 3000
      });
    }

    return steps;
  };

  const runIntegrationTest = async () => {
    if (!service) return;

    setTesting(true);
    setTestResults(null);
    setCurrentStep(0);

    const steps = generateTestSteps(service);
    setTestSteps(steps);

    const results = {
      service_name: service?.name,
      service_id: service?.id,
      test_start: new Date()?.toISOString(),
      steps: {},
      overall_status: 'running',
      errors: []
    };

    try {
      // Run each test step
      for (let i = 0; i < steps?.length; i++) {
        setCurrentStep(i);
        const step = steps?.[i];
        
        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        // Generate mock results
        const success = Math.random() > 0.1; // 90% success rate
        const responseTime = Math.floor(Math.random() * 1000) + 100;
        
        results.steps[step.id] = {
          name: step?.name,
          status: success ? 'passed' : 'failed',
          response_time: responseTime,
          details: success 
            ? `${step?.name} completed successfully in ${responseTime}ms`
            : `${step?.name} failed: ${getRandomError()}`,
          timestamp: new Date()?.toISOString()
        };

        if (!success) {
          results?.errors?.push({
            step: step?.id,
            message: getRandomError()
          });
        }
      }

      // Determine overall status
      const failedSteps = Object.values(results?.steps)?.filter(step => step?.status === 'failed');
      results.overall_status = failedSteps?.length === 0 ? 'passed' : 'failed';
      results.test_end = new Date()?.toISOString();

      // Update service health in database (mock implementation)
      if (results?.overall_status === 'passed') {
        await integrationStatusService?.testServiceHealth(service?.id);
      }

    } catch (error) {
      results.overall_status = 'error';
      results?.errors?.push({
        step: 'system',
        message: error?.message
      });
    }

    setTestResults(results);
    setTesting(false);
    setCurrentStep(steps?.length);
  };

  const getRandomError = () => {
    const errors = [
      'Connection timeout after 30 seconds',
      'Authentication failed: Invalid credentials',
      'Service returned HTTP 503: Service Unavailable',
      'SSL certificate verification failed',
      'Rate limit exceeded: Too many requests',
      'Network unreachable: DNS resolution failed'
    ];
    return errors?.[Math.floor(Math.random() * errors?.length)];
  };

  const getStepStatus = (stepIndex) => {
    if (testing && stepIndex === currentStep) return 'running';
    if (testing && stepIndex > currentStep) return 'pending';
    if (!testing && testResults) {
      const stepId = testSteps?.[stepIndex]?.id;
      return testResults?.steps?.[stepId]?.status || 'pending';
    }
    return 'pending';
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'passed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'failed':
        return { icon: 'XCircle', color: 'text-destructive' };
      case 'running':
        return { icon: 'Loader', color: 'text-primary' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  useEffect(() => {
    if (service) {
      setTestSteps(generateTestSteps(service));
    }
  }, [service]);

  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Integration Test</h3>
            <p className="text-sm text-muted-foreground">{service?.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Service Type:</span>
                <span className="ml-2 font-medium capitalize">{service?.service_type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Environment:</span>
                <span className="ml-2 font-medium capitalize">{service?.environment}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Endpoint:</span>
                <span className="ml-2 font-medium break-all">{service?.endpoint_url || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Version:</span>
                <span className="ml-2 font-medium">{service?.version || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Test Steps */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Test Progress</h4>
            <div className="space-y-3">
              {testSteps?.map((step, index) => {
                const status = getStepStatus(index);
                const statusIcon = getStepIcon(status);
                
                return (
                  <div key={step?.id} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                    <Icon 
                      name={statusIcon?.icon} 
                      size={20} 
                      className={`${statusIcon?.color} ${status === 'running' ? 'animate-spin' : ''}`}
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground">{step?.name}</h5>
                      <p className="text-sm text-muted-foreground">{step?.description}</p>
                      {testResults?.steps?.[step?.id] && (
                        <div className="mt-2">
                          <p className={`text-xs ${
                            testResults?.steps?.[step?.id]?.status === 'passed' ? 'text-success' : 'text-destructive'
                          }`}>
                            {testResults?.steps?.[step?.id]?.details}
                          </p>
                        </div>
                      )}
                    </div>
                    {testResults?.steps?.[step?.id]?.response_time && (
                      <span className="text-xs text-muted-foreground">
                        {testResults?.steps?.[step?.id]?.response_time}ms
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Results Summary */}
          {testResults && (
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Test Results</h4>
              <div className={`p-4 rounded-lg border-2 ${
                testResults?.overall_status === 'passed' ?'border-success/20 bg-success/5' :'border-destructive/20 bg-destructive/5'
              }`}>
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={testResults?.overall_status === 'passed' ? 'CheckCircle' : 'XCircle'} 
                    size={24}
                    className={testResults?.overall_status === 'passed' ? 'text-success' : 'text-destructive'}
                  />
                  <div>
                    <h5 className="font-medium">
                      {testResults?.overall_status === 'passed' ? 'All Tests Passed' : 'Some Tests Failed'}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Completed at {new Date(testResults?.test_end || testResults?.test_start)?.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {testResults?.errors?.length > 0 && (
                  <div className="mt-4">
                    <h6 className="text-sm font-medium text-destructive mb-2">Errors:</h6>
                    <ul className="space-y-1">
                      {testResults?.errors?.map((error, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {error?.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={testing ? undefined : runIntegrationTest}
            disabled={testing}
          >
            <Icon name={testing ? "Loader" : "Zap"} size={16} className={testing ? "animate-spin" : ""} />
            {testing ? "Running Tests..." : "Run Test"}
          </Button>
          {testResults && (
            <Button onClick={onTestComplete}>
              <Icon name="CheckCircle" size={16} />
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationTestModal;