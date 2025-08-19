import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import ConversationSidebar from './components/ConversationSidebar';
import ChatArea from './components/ChatArea';
import KnowledgePanel from './components/KnowledgePanel';
import ChatToolbar from './components/ChatToolbar';
import { getAIResponse, getModelServiceType } from '../../services/aiService';

const AIChatInterface = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [knowledgePanelCollapsed, setKnowledgePanelCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userRole] = useState('admin');

  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: 'VPN Connection Issues',
      preview: 'Users unable to connect to corporate VPN from remote locations',
      timestamp: new Date(Date.now() - 900000),
      category: 'network',
      status: 'active',
      messageCount: 12
    },
    {
      id: 2,
      title: 'Database Backup Procedure',
      preview: 'Setting up automated daily backups for production database',
      timestamp: new Date(Date.now() - 3600000),
      category: 'system',
      status: 'resolved',
      messageCount: 8
    },
    {
      id: 3,
      title: 'Security Policy Updates',
      preview: 'Implementing new password complexity requirements',
      timestamp: new Date(Date.now() - 7200000),
      category: 'security',
      status: 'pending',
      messageCount: 15
    },
    {
      id: 4,
      title: 'Email Server Configuration',
      preview: 'Configuring SMTP settings for new email domain',
      timestamp: new Date(Date.now() - 86400000),
      category: 'system',
      status: 'resolved',
      messageCount: 6
    },
    {
      id: 5,
      title: 'Firewall Rule Management',
      preview: 'Adding new rules for application server access',
      timestamp: new Date(Date.now() - 172800000),
      category: 'security',
      status: 'active',
      messageCount: 9
    }
  ]);

  // Enhanced mock messages for active conversation showcasing FITS AI capabilities
  const mockMessages = [
    {
      id: 1,
      sender: 'user',
      content: `We're experiencing VPN connection issues with remote users. They can authenticate but can't access internal resources. What troubleshooting steps should we follow?`,
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    {
      id: 2,
      sender: 'ai',
      content: `**FITS AI - Enterprise IT Analysis**

Based on your VPN connectivity issue, I'll provide a systematic troubleshooting approach:

**Step 1: Verify Network Connectivity**
\`\`\`bash
# Test basic connectivity from client
ping vpn-gateway.company.com
nslookup internal-server.company.local
traceroute 192.168.1.10
\`\`\`

**Step 2: Review VPN Client Configuration**
- Check if routes are being pushed correctly
- Verify split tunneling settings
- Confirm DNS server assignment

**Step 3: Server-Side Diagnostics**
\`\`\`bash
# Check OpenVPN server logs
sudo tail -f /var/log/openvpn/openvpn.log
# Verify routing table
ip route show
# Check iptables rules
sudo iptables -L FORWARD -v
\`\`\`

**Common Solutions:**
1. Add route push directives to server config
2. Configure proper firewall rules for VPN subnet
3. Verify internal DNS resolution

Which VPN solution are you using, and have you checked the server logs for any specific errors?`,
      timestamp: new Date(Date.now() - 1740000),
      type: 'text',model: 'FITS AI (GPT-3.5)',responseTime: 1250,serviceType: 'openai'
    },
    {
      id: 3,
      sender: 'user',content: `We're using OpenVPN. I've checked the server logs and see successful authentications, but users report they can't access file shares or internal web applications.`,timestamp: new Date(Date.now() - 1680000),type: 'text'
    },
    {
      id: 4,
      sender: 'ai',content: `Based on successful authentication but failed resource access, this appears to be a routing or firewall issue. Let's focus on the network configuration:\n\n**Immediate Checks:**\n\n1. **Routing Table Verification**\n   \`\`\`bash\n   # On VPN server\n   ip route show\n   # Look for routes to internal subnets\n   \`\`\`\n\n2. **Client Route Push Configuration**\n   Check your OpenVPN server config for:\n   \`\`\`\n   push "route 192.168.1.0 255.255.255.0"\n   push "route 10.0.0.0 255.0.0.0"\n   \`\`\`\n\n3. **Firewall Rules**\n   Ensure iptables/firewall allows traffic between VPN subnet and internal networks:\n   \`\`\`bash\n   iptables -I FORWARD -s 10.8.0.0/24 -d 192.168.1.0/24 -j ACCEPT\n   iptables -I FORWARD -s 192.168.1.0/24 -d 10.8.0.0/24 -j ACCEPT\n   \`\`\`\n\nCan you check what routes are being pushed to clients and share your current server configuration?`,
      timestamp: new Date(Date.now() - 1620000),
      type: 'text',model: 'Mistral 7B',
      responseTime: 1180
    }
  ];

  useEffect(() => {
    // Set initial active conversation and messages
    if (conversations?.length > 0 && !activeConversation) {
      setActiveConversation(conversations?.[0]);
      setMessages(mockMessages);
    }
  }, [conversations]);

  const handleNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: 'New Conversation',
      preview: 'Start a new conversation with AI assistant',
      timestamp: new Date(),
      category: 'general',
      status: 'active',
      messageCount: 0
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setMessages([]);
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    // In a real app, this would load messages for the selected conversation
    if (conversation?.id === 1) {
      setMessages(mockMessages);
    } else {
      setMessages([]);
    }
  };

  const handleDeleteConversation = (conversationId) => {
    setConversations(prev => prev?.filter(conv => conv?.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
      setMessages([]);
    }
  };

  const handleSendMessage = async (content, options = {}) => {
    if (!activeConversation || !content?.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: content?.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Validate API keys before making requests
      const hasOpenAIKey = import.meta.env?.VITE_OPENAI_API_KEY && 
                          import.meta.env?.VITE_OPENAI_API_KEY !== 'your-openai-api-key-here';
      const hasGeminiKey = import.meta.env?.VITE_GEMINI_API_KEY && 
                          import.meta.env?.VITE_GEMINI_API_KEY !== 'your-gemini-api-key-here';
      
      // Check if selected model is available
      const serviceType = getModelServiceType(selectedModel);
      if (serviceType === 'openai' && !hasOpenAIKey) {
        throw new Error('OpenAI API key is not configured. Please add your API key to the environment variables.');
      }
      if (serviceType === 'gemini' && !hasGeminiKey) {
        throw new Error('Gemini API key is not configured. Please add your API key to the environment variables.');
      }

      // Use streaming for real-time response
      let aiResponseContent = '';
      const aiMessageId = Date.now() + 1;
      
      // Create placeholder AI message
      const aiMessage = {
        id: aiMessageId,
        sender: 'ai',
        content: '',
        timestamp: new Date(),
        type: 'text',
        model: selectedModel,
        serviceType: getModelServiceType(selectedModel),
        responseTime: 0,
        isStreaming: true,
        contentType: options?.contentType || 'text',
        isVideoContent: options?.generateVideo || options?.contentType === 'video'
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // Stream the response with video generation options
      const response = await getAIResponse(
        content, 
        selectedModel, 
        (chunk) => {
          aiResponseContent += chunk;
          setMessages(prev => prev?.map(msg => 
            msg?.id === aiMessageId 
              ? { ...msg, content: aiResponseContent }
              : msg
          ));
        },
        options // Pass through video generation options
      );

      // Update final message with complete response and metadata
      setMessages(prev => prev?.map(msg => 
        msg?.id === aiMessageId 
          ? {
              ...msg,
              content: response?.content || aiResponseContent,
              responseTime: response?.responseTime,
              serviceType: response?.serviceType,
              isStreaming: false,
              success: response?.success !== false,
              error: response?.error,
              isVideoContent: response?.isVideoContent || options?.generateVideo
            }
          : msg
      ));

      // Update conversation message count
      setConversations(prev => prev?.map(conv => 
        conv?.id === activeConversation?.id 
          ? { ...conv, messageCount: (conv?.messageCount || 0) + 2 }
          : conv
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove streaming placeholder if it exists
      setMessages(prev => prev?.filter(msg => !msg?.isStreaming));
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 2,
        sender: 'ai',
        content: `I apologize, but I encountered an error while processing your request: ${error?.message}. Please check your internet connection and API configuration, then try again.`,
        timestamp: new Date(),
        type: 'text',
        model: selectedModel,
        serviceType: getModelServiceType(selectedModel),
        responseTime: 0,
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    
    // Add system message about model change
    if (activeConversation && messages?.length > 0) {
      const systemMessage = {
        id: Date.now(),
        sender: 'system',
        content: `Switched to ${modelId}. This model ${getModelServiceType(modelId) === 'openai' ? 'uses OpenAI\'s cloud service' : 'runs locally on your infrastructure'} for enhanced data security.`,
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  const handleExportConversation = (conversation, format) => {
    console.log(`Exporting conversation ${conversation?.id} as ${format}`);
    // Implementation would handle actual export
  };

  const handleShareConversation = (conversation, method) => {
    console.log(`Sharing conversation ${conversation?.id} via ${method}`);
    // Implementation would handle actual sharing
  };

  const handleArchiveConversation = (conversation) => {
    console.log(`Archiving conversation ${conversation?.id}`);
    // Implementation would handle archiving
  };

  const handleArticleClick = (article) => {
    navigate('/knowledge-base-management-content-administration', { 
      state: { selectedArticle: article } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
      />
      
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={userRole}
      />
      
      <main 
        className={`transition-all duration-normal ${
          sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar'
        } mt-16`}
      >
        <div className="h-[calc(100vh-4rem)] flex">
          {/* Conversation Sidebar */}
          <ConversationSidebar
            conversations={conversations}
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
            userRole={userRole}
          />
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <ChatToolbar
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
              conversation={activeConversation}
              onExportConversation={handleExportConversation}
              onShareConversation={handleShareConversation}
              onArchiveConversation={handleArchiveConversation}
              userRole={userRole}
            />
            
            <ChatArea
              conversation={activeConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              selectedModel={selectedModel}
              userRole={userRole}
            />
          </div>
          
          {/* Knowledge Panel */}
          <KnowledgePanel
            conversation={activeConversation}
            onArticleClick={handleArticleClick}
            isCollapsed={knowledgePanelCollapsed}
            onToggleCollapse={() => setKnowledgePanelCollapsed(!knowledgePanelCollapsed)}
          />
        </div>
      </main>
    </div>
  );
};

export default AIChatInterface;