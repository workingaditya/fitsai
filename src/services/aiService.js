import openai from './openaiClient';
import { getVideoContent, streamVideoScript } from './geminiService';

/**
 * FITS AI Service - Handles AI interactions for enterprise IT problems
 * Supports local LLMs, OpenAI integration, and GEMINI video generation
 */

/**
 * Generates a chat completion response using OpenAI with quota error handling
 * @param {string} userMessage - The user's input message
 * @param {string} systemPrompt - System prompt for context
 * @param {string} model - OpenAI model to use
 * @returns {Promise<string>} The assistant's response
 */
export async function getOpenAIChatCompletion(userMessage, systemPrompt = null, model = 'gpt-4') {
  try {
    const systemMessage = systemPrompt || `You are FITS AI, an enterprise IT support assistant. You specialize in:
- IT problem diagnosis and troubleshooting
- System administration guidance
- Network security best practices
- Database management
- Application deployment
- Infrastructure monitoring
- Compliance and audit procedures

Always provide practical, step-by-step solutions with code examples when applicable. Focus on enterprise-grade security and best practices.`;

    const response = await openai?.chat?.completions?.create({
      model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error in OpenAI chat completion:', error);
    
    // Handle quota exceeded error specifically
    if (error?.status === 429 || error?.message?.includes('quota') || error?.message?.includes('429')) {
      throw new Error('OpenAI API quota exceeded. Please check your plan and billing details, or try using a local model instead.');
    }
    
    // Handle other API errors
    if (error?.status === 401) {
      throw new Error('OpenAI API key is invalid. Please check your VITE_OPENAI_API_KEY configuration.');
    }
    
    if (error?.status === 403) {
      throw new Error('OpenAI API access denied. Please verify your account permissions.');
    }
    
    throw new Error(`OpenAI API Error: ${error?.message || 'Failed to get response'}`);
  }
}

/**
 * Streams a chat completion response chunk by chunk using OpenAI with enhanced error handling
 * @param {string} userMessage - The user's input message
 * @param {Function} onChunk - Callback to handle each streamed chunk
 * @param {string} systemPrompt - System prompt for context
 * @param {string} model - OpenAI model to use
 */
export async function getStreamingOpenAICompletion(userMessage, onChunk, systemPrompt = null, model = 'gpt-4') {
  try {
    const systemMessage = systemPrompt || `You are FITS AI, an enterprise IT support assistant specialized in IT problem-solving and system administration.`;

    const stream = await openai?.chat?.completions?.create({
      model,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      let content = chunk?.choices?.[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        onChunk(content);
      }
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Error in streaming OpenAI completion:', error);
    
    // Handle quota exceeded error specifically
    if (error?.status === 429 || error?.message?.includes('quota') || error?.message?.includes('429')) {
      const fallbackMessage = 'OpenAI API quota exceeded. Switching to fallback response mode.';
      onChunk?.(fallbackMessage);
      throw new Error('OpenAI API quota exceeded. Please check your plan and billing details, or try using a local model instead.');
    }
    
    throw new Error(`OpenAI Streaming Error: ${error?.message || 'Failed to stream response'}`);
  }
}

/**
 * Generates structured responses using OpenAI with JSON schema
 * @param {string} userMessage - The user's input message
 * @param {object} schema - JSON schema for structured output
 * @param {string} model - OpenAI model to use (only gpt-4o supported)
 * @returns {Promise<object>} Structured response object
 */
export async function getStructuredOpenAIResponse(userMessage, schema, model = 'gpt-4o') {
  try {
    const response = await openai?.chat?.completions?.create({
      model,
      messages: [
        { 
          role: 'system', 
          content: 'You are FITS AI, an enterprise IT support assistant. Provide structured responses for IT problem analysis.' 
        },
        { role: 'user', content: userMessage },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'it_analysis_response',
          schema: {
            type: 'object',
            properties: schema,
            required: Object.keys(schema),
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error in structured OpenAI response:', error);
    throw new Error(`OpenAI Structured Response Error: ${error?.message || 'Failed to get structured response'}`);
  }
}

/**
 * Generates how-to video content using GEMINI (Google Veo alternative)
 * @param {string} userMessage - The user's request for video content
 * @param {Function} onChunk - Optional streaming callback
 * @param {object} options - Additional options (videoType, contentType, etc.)
 * @returns {Promise<object>} Video content response
 */
export async function generateHowToVideo(userMessage, onChunk = null, options = {}) {
  try {
    const { videoType = 'howto', contentType = 'script' } = options;
    
    if (onChunk) {
      // Stream video script generation
      return await streamVideoScript(userMessage, onChunk, videoType);
    } else {
      // Generate complete video content
      return await getVideoContent(userMessage, contentType, { videoType, ...options });
    }
  } catch (error) {
    console.error('Error generating how-to video:', error);
    throw new Error(`Gemini Video Generation Error: ${error?.message || 'Failed to generate video content'}`);
  }
}

/**
 * Simulates local LLM responses for models like Mistral, Llama, etc.
 * In a real implementation, this would connect to local model endpoints
 * @param {string} userMessage - The user's input message
 * @param {string} modelId - Local model identifier
 * @param {Function} onChunk - Optional callback for streaming
 * @returns {Promise<string>} The model's response
 */
export async function getLocalLLMResponse(userMessage, modelId, onChunk = null) {
  // Simulate local LLM processing time
  const processingTime = Math.floor(Math.random() * 2000) + 1000;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = {
        'mistral-7b': generateMistralResponse(userMessage),
        'llama-2-13b': generateLlamaResponse(userMessage),
        'code-llama-34b': generateCodeLlamaResponse(userMessage),
        'vicuna-13b': generateVicunaResponse(userMessage),
        'alpaca-7b': generateAlpacaResponse(userMessage),
        'falcon-40b': generateFalconResponse(userMessage),
        'wizardlm-13b': generateWizardLMResponse(userMessage),
        'orca-13b': generateOrcaResponse(userMessage),
      };

      const response = responses[modelId] || `Local ${modelId} response for: "${userMessage}"`;
      
      if (onChunk) {
        // Simulate streaming for local models
        const words = response.split(' ');
        let currentResponse = '';
        
        words.forEach((word, index) => {
          setTimeout(() => {
            currentResponse += (index === 0 ? word : ` ${word}`);
            onChunk(index === 0 ? word : ` ${word}`);
            
            if (index === words.length - 1) {
              resolve(currentResponse);
            }
          }, index * 100);
        });
      } else {
        resolve(response);
      }
    }, processingTime);
  });
}

/**
 * Determines the appropriate AI service based on model type
 * @param {string} modelId - The model identifier
 * @returns {string} Service type: 'openai', 'gemini', or 'local'
 */
export function getModelServiceType(modelId) {
  const openAIModels = ['gpt-4', 'gpt-4o', 'gpt-3.5-turbo', 'gpt-4-turbo'];
  const geminiModels = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro-vision'];
  
  if (openAIModels?.includes(modelId)) return 'openai';
  if (geminiModels?.includes(modelId)) return 'gemini';
  return 'local';
}

/**
 * Enhanced AI response handler with fallback mechanisms for quota errors
 * @param {string} userMessage - The user's input message
 * @param {string} modelId - The model identifier  
 * @param {Function} onChunk - Optional streaming callback
 * @param {object} options - Additional options for video generation
 * @returns {Promise<object>} Response with content and metadata
 */
export async function getAIResponse(userMessage, modelId, onChunk = null, options = {}) {
  const startTime = Date.now();
  
  try {
    // Validate input parameters
    if (!userMessage?.trim()) {
      throw new Error('Message content is required');
    }
    
    if (!modelId) {
      throw new Error('Model ID is required');
    }

    // Validate API keys
    const serviceType = getModelServiceType(modelId);
    const hasOpenAIKey = import.meta.env?.VITE_OPENAI_API_KEY && 
                        import.meta.env?.VITE_OPENAI_API_KEY !== 'your-openai-api-key-here';
    const hasGeminiKey = import.meta.env?.VITE_GEMINI_API_KEY && 
                        import.meta.env?.VITE_GEMINI_API_KEY !== 'your-gemini-api-key-here';
    
    if (serviceType === 'openai' && !hasOpenAIKey) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }
    if (serviceType === 'gemini' && !hasGeminiKey) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    let content;
    
    // Check if user is requesting video content - ALWAYS use Gemini for video generation
    const isVideoRequest = userMessage?.toLowerCase()?.includes('video') || 
                          userMessage?.toLowerCase()?.includes('how to') ||
                          userMessage?.toLowerCase()?.includes('tutorial') ||
                          userMessage?.toLowerCase()?.includes('convert to') ||
                          options?.contentType === 'video' ||
                          options?.generateVideo ||
                          options?.videoType === 'howto';
    
    // Force video requests to use Gemini regardless of selected model
    if (isVideoRequest) {
      console.log('Video request detected - routing to Gemini for video generation');
      
      if (!hasGeminiKey) {
        throw new Error('Video generation requires Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file.');
      }
      
      const videoResponse = await generateHowToVideo(userMessage, onChunk, {
        ...options,
        videoType: 'howto',
        contentType: 'script'
      });
      content = videoResponse?.content || videoResponse?.script?.description || videoResponse?.rawContent;
      
      const responseTime = Date.now() - startTime;
      return {
        content,
        model: 'gemini-1.5-pro',
        serviceType: 'gemini',
        responseTime,
        timestamp: new Date(),
        success: true,
        isVideoContent: true,
        videoResponse: videoResponse
      };
    }
    
    // Handle regular chat responses based on selected model with fallback
    if (serviceType === 'openai') {
      try {
        if (onChunk) {
          content = await getStreamingOpenAICompletion(userMessage, onChunk, null, modelId);
        } else {
          content = await getOpenAIChatCompletion(userMessage, null, modelId);
        }
      } catch (openAIError) {
        // If OpenAI fails due to quota, try Gemini as fallback
        if (openAIError?.message?.includes('quota') && hasGeminiKey) {
          console.warn('OpenAI quota exceeded, falling back to Gemini');
          const fallbackMessage = '🔄 OpenAI quota exceeded. Switching to Gemini model for your request...';
          onChunk?.(fallbackMessage);
          
          const geminiResponse = await getVideoContent(userMessage, 'text', { 
            videoType: 'chat',
            streaming: Boolean(onChunk),
            onChunk: (chunk) => onChunk?.(chunk)
          });
          content = geminiResponse?.content || geminiResponse?.script?.description || geminiResponse?.rawContent;
          
          const responseTime = Date.now() - startTime;
          return {
            content: `${fallbackMessage}\n\n${content}`,
            model: 'gemini-1.5-pro (fallback)',
            serviceType: 'gemini',
            responseTime,
            timestamp: new Date(),
            success: true,
            isVideoContent: false,
            fallbackUsed: true,
            originalError: openAIError?.message
          };
        } else if (openAIError?.message?.includes('quota')) {
          // If no Gemini fallback available, suggest local models
          const localFallbackMessage = `⚠️ OpenAI quota exceeded and no alternative API keys available. 

**Suggested Solutions:**
1. **Check your OpenAI billing**: Visit https://platform.openai.com/account/billing
2. **Try local models**: Switch to Mistral, Llama, or other local models in the model selector
3. **Use Gemini**: Add VITE_GEMINI_API_KEY to your .env file for Gemini access
4. **Wait and retry**: API quotas typically reset monthly

**Quick Fix**: Try selecting a local model like "mistral-7b" or "llama-2-13b" from the model dropdown to continue your work without API limitations.`;
          
          onChunk?.(localFallbackMessage);
          
          const responseTime = Date.now() - startTime;
          return {
            content: localFallbackMessage,
            model: modelId,
            serviceType: 'openai',
            responseTime,
            timestamp: new Date(),
            success: false,
            error: 'OpenAI quota exceeded - no fallback available',
            quotaExceeded: true,
            suggestions: ['Use local models', 'Check billing', 'Add Gemini API key']
          };
        }
        throw openAIError;
      }
    } else if (serviceType === 'gemini') {
      // Use GEMINI for regular text generation as well
      const geminiResponse = await getVideoContent(userMessage, 'text', { 
        videoType: 'chat',
        streaming: Boolean(onChunk),
        onChunk 
      });
      content = geminiResponse?.content || geminiResponse?.script?.description || geminiResponse?.rawContent;
    } else {
      content = await getLocalLLMResponse(userMessage, modelId, onChunk);
    }
    
    const responseTime = Date.now() - startTime;
    
    return {
      content: content || 'No response received from the AI service.',
      model: modelId,
      serviceType,
      responseTime,
      timestamp: new Date(),
      success: true,
      isVideoContent: false
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`AI Response Error (${modelId}):`, error);
    
    // Enhanced error handling with specific guidance
    let errorMessage = error?.message;
    let suggestions = [];
    
    if (error?.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Your current plan has reached its usage limit.';
      suggestions = [
        'Check your billing and usage at https://platform.openai.com/account/billing',
        'Try using local models (Mistral, Llama, etc.)',
        'Consider upgrading your API plan',
        'Add alternative API keys (Gemini) as backup'
      ];
    } else if (error?.message?.includes('401') || error?.message?.includes('invalid')) {
      errorMessage = 'API key authentication failed.';
      suggestions = [
        'Check your .env file for correct API key format',
        'Verify API key permissions on the provider dashboard',
        'Try regenerating your API key'
      ];
    }
    
    return {
      content: `Sorry, I encountered an error while processing your request: ${errorMessage}${suggestions?.length > 0 ? '\n\n**Suggestions:**\n' + suggestions?.map(s => `• ${s}`)?.join('\n') : ''}`,
      model: modelId,
      serviceType: getModelServiceType(modelId),
      responseTime,
      timestamp: new Date(),
      success: false,
      error: errorMessage,
      suggestions
    };
  }
}

function generateMistralResponse(message) {
  return `**FITS AI (Mistral 7B) - Enterprise IT Analysis**

Based on your query: "${message}"

This is a comprehensive IT solution approach using local Mistral 7B model for enterprise data security:

**Key Analysis Points:**
• Problem categorization and priority assessment
• Step-by-step troubleshooting methodology
• Security considerations and compliance requirements
• Resource optimization and performance impact

**Recommended Actions:**
1. Initial diagnostic procedures
2. Risk assessment and mitigation strategies  
3. Implementation guidelines with rollback plans
4. Monitoring and validation steps

Would you like me to elaborate on any specific aspect of this IT problem?`;
}

function generateLlamaResponse(message) {
  return `**Advanced IT Analysis - Llama 2 13B**

Enterprise problem analysis for: "${message}"

**Comprehensive Solution Framework:**

**Phase 1: Assessment**
- Current state evaluation
- Impact analysis on business operations
- Resource requirement assessment

**Phase 2: Strategy Development**  
- Multiple solution pathways
- Risk-benefit analysis
- Timeline and dependency mapping

**Phase 3: Implementation**
- Detailed execution steps
- Quality assurance checkpoints
- Change management procedures

This analysis leverages advanced reasoning capabilities for complex enterprise IT scenarios. Local processing ensures your sensitive data remains secure.`;
}

function generateCodeLlamaResponse(message) {
  return `**Code Analysis & Automation - Code Llama 34B**

Technical solution for: "${message}"

\`\`\`bash
# Automated diagnostic script
#!/bin/bash
echo "FITS AI - Enterprise IT Automation"

# System health check
systemctl status --no-pager
df -h
free -h

# Network diagnostics
netstat -tlnp | grep :80
ss -tuln

# Log analysis
tail -f /var/log/syslog | grep ERROR
\`\`\`

**Code-Driven Solutions:**
• Automated monitoring scripts
• Infrastructure as Code templates
• CI/CD pipeline integration
• Custom troubleshooting tools

**Security Best Practices:**
• Input validation and sanitization
• Secure credential management
• Audit logging implementation
• Access control mechanisms

Specialized in code analysis, script automation, and DevOps integration for enterprise IT operations.`;
}

function generateVicunaResponse(message) {
  return `**Detailed IT Guidance - Vicuna 13B**

Let me provide a comprehensive explanation for: "${message}"

**Understanding the Problem:**
This appears to be a common enterprise IT challenge that requires careful analysis and systematic approach. Based on similar cases in enterprise environments, I can guide you through the resolution process.

**Detailed Explanation:**
The underlying issue typically stems from configuration misalignments, resource constraints, or integration complexities. Here's how we should approach this:

**Step-by-Step Resolution:**
1. **Initial Assessment** - Gather system information and current configuration state
2. **Root Cause Analysis** - Use diagnostic tools to identify the primary issue
3. **Solution Planning** - Develop a comprehensive remediation strategy
4. **Implementation** - Execute changes with proper testing and validation
5. **Documentation** - Record the solution for future reference

**Additional Considerations:**
- Impact on other systems and services
- Compliance and security implications
- Performance optimization opportunities
- Long-term maintenance requirements

I specialize in providing detailed, conversational guidance that helps you understand not just the "what" but also the "why" behind each recommendation.`;
}

function generateAlpacaResponse(message) {
  return `**Quick IT Response - Alpaca 7B**

Fast analysis for: "${message}"

**Immediate Actions:**
✓ Check system status and logs
✓ Verify network connectivity  
✓ Review recent configuration changes
✓ Test basic functionality

**Common Solutions:**
• Service restart: \`sudo systemctl restart service-name\`
• Clear cache: \`sudo apt clean && sudo apt autoclean\`
• Check permissions: \`ls -la /path/to/resource\`
• Monitor resources: \`htop\` or \`top\`

**Next Steps:**
1. Apply immediate fixes
2. Monitor for stability
3. Document the resolution
4. Consider preventive measures

Optimized for quick responses and basic troubleshooting guidance. Perfect for straightforward IT queries that need immediate attention.`;
}

function generateFalconResponse(message) {
  return `**Enterprise-Grade Analysis - Falcon 40B**

**Executive Summary:**
Advanced enterprise analysis for: "${message}"

**Strategic IT Assessment:**
This enterprise-grade analysis leverages comprehensive knowledge bases and advanced reasoning capabilities to provide sophisticated solutions for complex IT infrastructure challenges.

**Multi-Dimensional Analysis:**
• **Technical Layer:** Deep system architecture review
• **Security Layer:** Comprehensive threat assessment and mitigation
• **Business Layer:** Impact analysis on operational continuity  
• **Compliance Layer:** Regulatory requirement validation

**Advanced Solution Architecture:**
\`\`\`
┌─ Assessment Phase
├─ Strategy Formulation
├─ Risk Analysis & Mitigation
├─ Implementation Planning
├─ Quality Assurance Framework
└─ Continuous Monitoring Strategy
\`\`\`

**Enterprise Integration Points:**
- Identity and Access Management (IAM) integration
- Enterprise Service Bus (ESB) compatibility
- Database cluster optimization
- Load balancing and failover mechanisms
- Disaster recovery and business continuity planning

**Performance Metrics & KPIs:**
- System availability: Target 99.9% uptime
- Response time optimization: <200ms average
- Security incident reduction: 95% improvement
- Operational cost efficiency: 30% reduction

This high-performance analysis is designed for mission-critical enterprise environments requiring exceptional accuracy and comprehensive coverage.`;
}

function generateWizardLMResponse(message) {
  return `**Step-by-Step Technical Guidance - WizardLM 13B**

**Problem:** "${message}"

**🎯 Systematic Solution Approach:**

**Step 1: Environment Preparation**
\`\`\`bash
# Verify system requirements
uname -a
cat /etc/os-release
\`\`\`
*Why this step:* Understanding your environment is crucial for selecting the right solution approach.

**Step 2: Diagnostic Information Gathering**
\`\`\`bash
# Collect system information
sudo journalctl -xe | tail -50
sudo dmesg | grep -i error
\`\`\`
*Why this step:* Logs provide the diagnostic information needed to identify root causes.

**Step 3: Configuration Verification**
\`\`\`bash
# Check service configurations
sudo systemctl status target-service
sudo nginx -t  # for web services
\`\`\`
*Why this step:* Configuration issues are the most common cause of service failures.

**Step 4: Solution Implementation**
\`\`\`bash
# Apply the fix (example)
sudo systemctl reload configuration
sudo systemctl restart service-name
\`\`\`
*Why this step:* Systematic application of fixes ensures consistency and reliability.

**Step 5: Validation and Testing**
\`\`\`bash
# Verify the solution works
curl -I http://localhost:service-port
sudo systemctl is-active service-name
\`\`\`
*Why this step:* Validation ensures the problem is truly resolved.

**🔍 Troubleshooting Tips:**
- Always backup configurations before making changes
- Test in a non-production environment first
- Document each step for future reference
- Monitor system performance after changes

I specialize in breaking down complex IT problems into manageable, sequential steps with clear explanations of why each step is necessary.`;
}

function generateOrcaResponse(message) {
  return `**Security-Focused IT Analysis - Orca 13B**

**Security Assessment for:** "${message}"

**🛡️ Security Threat Analysis:**

**Immediate Security Considerations:**
• **Authentication:** Verify identity management systems
• **Authorization:** Review access control mechanisms  
• **Encryption:** Ensure data protection in transit and at rest
• **Audit:** Implement comprehensive logging and monitoring

**Security Risk Matrix:**
High Risk    | Critical system exposure, data breach potential
Medium Risk  | Service disruption, limited data access
Low Risk     | Minor configuration issues, logging gaps

**Compliance Framework Alignment:**
- **SOC 2 Type II:** Control environment and monitoring
- **ISO 27001:** Information security management
- **NIST Cybersecurity Framework:** Identify, Protect, Detect, Respond, Recover
- **GDPR/CCPA:** Data privacy and protection requirements

**Security Hardening Recommendations:**
# Security configuration examples
sudo ufw enable
sudo fail2ban-client status
sudo chkconfig --list | grep -E "(on|off)"

# Audit current security posture
sudo lynis audit system
sudo nmap -sV localhost

**Incident Response Protocol:**
1. **Containment:** Isolate affected systems
2. **Assessment:** Determine scope and impact
3. **Eradication:** Remove threats and vulnerabilities
4. **Recovery:** Restore services securely
5. **Lessons Learned:** Update security procedures

**Continuous Security Monitoring:**
- Real-time threat detection
- Automated vulnerability scanning
- Security event correlation
- Compliance reporting automation

Specialized in security-focused analysis with emphasis on threat mitigation, compliance requirements, and enterprise-grade security implementations.`;
}