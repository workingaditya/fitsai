import React, { useState } from 'react';
import { X, MessageSquare, BookOpen } from 'lucide-react';

const QuickActionModal = ({ onClose, knowledgeCategories }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [message, setMessage] = useState('');

  const quickActions = [
    {
      id: 'cant-connect',
      title: "I can\'t connect to something",
      description: "Network, WiFi, VPN, or server connection issues",
      icon: '🔌'
    },
    {
      id: 'software-issue',
      title: "Software isn\'t working",
      description: "Application crashes, errors, or not responding",
      icon: '💻'
    },
    {
      id: 'password-help',
      title: "Password or login problems",
      description: "Forgot password, locked account, or access issues",
      icon: '🔑'
    },
    {
      id: 'hardware-problem',
      title: "Hardware not working",
      description: "Printer, monitor, keyboard, mouse issues",
      icon: '🖥️'
    },
    {
      id: 'need-software',
      title: "I need new software",
      description: "Request installation or access to applications",
      icon: '📦'
    },
    {
      id: 'other',
      title: "Something else",
      description: "Other IT-related questions or issues",
      icon: '❓'
    }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!selectedAction || !message?.trim()) return;

    // In a real app, this would submit the quick action
    console.log('Quick action submitted:', { action: selectedAction, message });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Help Request</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">What do you need help with?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickActions?.map(action => (
                <button
                  key={action?.id}
                  type="button"
                  onClick={() => setSelectedAction(action?.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedAction === action?.id
                      ? 'border-blue-500 bg-blue-50' :'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{action?.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{action?.title}</h4>
                      <p className="text-sm text-gray-600">{action?.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedAction && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your issue in your own words
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e?.target?.value)}
                placeholder="Tell us what's happening and what you've already tried..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The more details you provide, the faster we can help you!
              </p>
            </div>
          )}

          {/* Suggested Articles */}
          {selectedAction && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Before submitting, check these helpful articles:
              </h4>
              <div className="space-y-1">
                {knowledgeCategories?.slice(0, 3)?.map(category => (
                  <div key={category?.id} className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                    • {category?.articles?.[0]?.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  // In a real app, this would open a chat
                  console.log('Starting chat...');
                  onClose();
                }}
                className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat Now
              </button>
              <button
                type="submit"
                disabled={!selectedAction || !message?.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickActionModal;