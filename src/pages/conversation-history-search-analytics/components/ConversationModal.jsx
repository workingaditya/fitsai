import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationModal = ({ conversation, isOpen, onClose, onExport, onCreateArticle }) => {
  const [activeTab, setActiveTab] = useState('conversation');

  if (!isOpen || !conversation) return null;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      resolved: { color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
      escalated: { color: 'bg-red-100 text-red-800', icon: 'AlertTriangle' },
      archived: { color: 'bg-gray-100 text-gray-800', icon: 'Archive' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} className="mr-1" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const mockMessages = [
    {
      id: 1,
      sender: 'user',
      content: `Hi, I'm having trouble connecting to the VPN. When I try to connect, it says "Connection failed - unable to establish secure tunnel". This started happening after the recent Windows update. Can you help me troubleshoot this issue?`,
      timestamp: new Date(conversation.timestamp.getTime() - 300000)
    },
    {
      id: 2,
      sender: 'ai',content: `I'll help you troubleshoot the VPN connection issue. This is a common problem after Windows updates. Let's go through a systematic approach:\n\n**Step 1: Check VPN Client Status**\n- Open your VPN client as administrator\n- Check if the client version is compatible with the recent Windows update\n- Look for any error messages in the client logs\n\n**Step 2: Network Adapter Reset**\n1. Press Windows + X and select "Device Manager"\n2. Expand "Network adapters"\n3. Right-click on your VPN adapter and select "Disable device"\n4. Wait 10 seconds, then right-click and select "Enable device"\n\n**Step 3: Reset Network Stack**\nOpen Command Prompt as administrator and run:\n\`\`\`\nnetsh winsock reset\nnetsh int ip reset\nipconfig /release\nipconfig /renew\nipconfig /flushdns\n\`\`\`\n\nTry connecting to the VPN after each step. Which step resolves the issue for you?`,
      timestamp: new Date(conversation.timestamp.getTime() - 240000)
    },
    {
      id: 3,
      sender: 'user',
      content: `Thanks for the detailed steps! I tried Step 1 and found that my VPN client is showing version 2.1.4, but I see there's a newer version 2.2.1 available. Should I update it first before trying the other steps?`,
      timestamp: new Date(conversation.timestamp.getTime() - 180000)
    },
    {
      id: 4,
      sender: 'ai',
      content: `Excellent observation! Yes, updating the VPN client should be your first priority. Version compatibility issues are often the root cause of VPN problems after Windows updates.\n\n**VPN Client Update Process:**\n1. Download version 2.2.1 from the official vendor website\n2. Close the current VPN client completely\n3. Uninstall the old version through Control Panel\n4. Restart your computer\n5. Install the new version as administrator\n6. Import your existing VPN configuration\n\n**After updating:**\n- Test the VPN connection\n- If it still fails, then proceed with the network adapter reset (Step 2)\n\nThe newer version likely includes fixes for Windows 11 22H2 compatibility issues. Let me know how the update goes!`,
      timestamp: new Date(conversation.timestamp.getTime() - 120000)
    },
    {
      id: 5,
      sender: 'user',
      content: `Perfect! I updated to version 2.2.1 and the VPN is now connecting successfully. The connection is stable and I can access all internal resources. Thank you for the quick and effective solution!`,
      timestamp: new Date(conversation.timestamp.getTime() - 60000)
    },
    {
      id: 6,
      sender: 'ai',
      content: `Excellent! I'm glad the VPN client update resolved the issue. This is a great example of why keeping software updated is crucial, especially after major OS updates.\n\n**For future reference:**\n- Enable automatic updates for your VPN client if available\n- Check for client updates before troubleshooting connection issues\n- Keep a backup of your VPN configuration files\n\n**Issue Summary:**\n- **Problem:** VPN connection failure after Windows update\n- **Root Cause:** Outdated VPN client (v2.1.4)\n- **Solution:** Updated to VPN client v2.2.1\n- **Resolution Time:** 15 minutes\n- **Status:** Resolved\n\nIs there anything else I can help you with regarding VPN or network connectivity?`,
      timestamp: conversation?.timestamp
    }
  ];

  const mockMetadata = {
    sessionDuration: '18 minutes',
    messageCount: 6,
    llmTokensUsed: 1247,
    knowledgeBaseSources: [
      'VPN Troubleshooting Guide v3.2',
      'Windows Update Compatibility Matrix',
      'Network Connectivity Best Practices'
    ],
    relatedTickets: [
      { id: 'INC-2025-001234', title: 'VPN Connection Issues Post-Update', status: 'Resolved' },
      { id: 'INC-2025-001189', title: 'Similar VPN Client Compatibility', status: 'Resolved' }
    ],
    tags: ['VPN', 'Windows Update', 'Network Connectivity', 'Client Software', 'Troubleshooting'],
    userSatisfactionRating: 5,
    feedback: 'Very helpful and detailed troubleshooting steps. Quick resolution!'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{conversation?.topic}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-600">
                  {formatTimestamp(conversation?.timestamp)}
                </span>
                <span className="text-sm text-gray-600">
                  User: {conversation?.user}
                </span>
                <span className="text-sm text-gray-600">
                  Model: {conversation?.llmModel}
                </span>
                {getStatusBadge(conversation?.status)}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport(conversation)}
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateArticle(conversation)}
              iconName="BookOpen"
              iconPosition="left"
            >
              Create Article
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('conversation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'conversation' ?'border-primary text-primary' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Conversation
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'metadata' ?'border-primary text-primary' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Metadata
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics' ?'border-primary text-primary' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'conversation' && (
            <div className="space-y-4">
              {mockMessages?.map((message) => (
                <div
                  key={message?.id}
                  className={`flex ${message?.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-3xl ${message?.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message?.sender === 'user' ? 'bg-blue-100' : 'bg-primary'
                      }`}>
                        <Icon 
                          name={message?.sender === 'user' ? 'User' : 'Bot'} 
                          size={16} 
                          color={message?.sender === 'user' ? '#3b82f6' : 'white'}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {message?.sender === 'user' ? conversation?.user : 'FITS AI'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(message?.timestamp)}
                      </span>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      message?.sender === 'user' ?'bg-blue-50 border border-blue-200' :'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="text-sm text-gray-900 whitespace-pre-wrap">
                        {message?.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Session Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="text-sm font-medium text-gray-900">{mockMetadata?.sessionDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Messages</span>
                      <span className="text-sm font-medium text-gray-900">{mockMetadata?.messageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">LLM Tokens Used</span>
                      <span className="text-sm font-medium text-gray-900">{mockMetadata?.llmTokensUsed?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User Rating</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)]?.map((_, i) => (
                          <Icon 
                            key={i}
                            name="Star" 
                            size={14} 
                            className={i < mockMetadata?.userSatisfactionRating ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {mockMetadata?.userSatisfactionRating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Knowledge Sources</h3>
                  <div className="space-y-2">
                    {mockMetadata?.knowledgeBaseSources?.map((source, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                        <Icon name="BookOpen" size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-900">{source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Related Tickets</h3>
                  <div className="space-y-2">
                    {mockMetadata?.relatedTickets?.map((ticket, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{ticket?.id}</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {ticket?.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{ticket?.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockMetadata?.tags?.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Icon name="Tag" size={10} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Feedback</h3>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-gray-900">{mockMetadata?.feedback}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Response Time</span>
                        <span className="text-sm text-green-600 font-medium">Excellent</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Average: 2.1 seconds</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Solution Accuracy</span>
                        <span className="text-sm text-green-600 font-medium">High</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">96% accuracy score</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">User Engagement</span>
                        <span className="text-sm text-blue-600 font-medium">Active</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">High interaction level</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation Flow</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Problem Identification</span>
                      <span className="text-xs text-gray-500 ml-auto">30s</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Troubleshooting Steps</span>
                      <span className="text-xs text-gray-500 ml-auto">8m 45s</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Solution Implementation</span>
                      <span className="text-xs text-gray-500 ml-auto">5m 30s</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Verification & Closure</span>
                      <span className="text-xs text-gray-500 ml-auto">3m 15s</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Knowledge Impact</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Reusability Score</span>
                      <span className="text-sm text-green-600 font-medium">High</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      This solution can be applied to similar VPN connectivity issues
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCreateArticle(conversation)}
                      iconName="Plus"
                      iconPosition="left"
                      className="w-full"
                    >
                      Convert to Knowledge Article
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationModal;