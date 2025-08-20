import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { sendChatToN8n } from '../../services/n8nService';
import { appConfig } from '../../config';
import { ArrowLeft, Send, Paperclip, RotateCcw, Bot, AlertCircle, Mic, MicOff, BookOpen, MessageCircle, HelpCircle, ChevronRight, FileDown, Image, Video } from 'lucide-react';

export default function EmployeeChatSupportInterface() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [sessionId, setSessionId] = useState(() => {
    // Persist a lightweight session id in localStorage per browser
    const existing = localStorage.getItem('employee_chat_session_id');
    if (existing) return existing;
    const sid = `sess_${crypto?.randomUUID?.() || Date.now()}`;
    try { localStorage.setItem('employee_chat_session_id', sid); } catch {}
    return sid;
  });
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [waitTime, setWaitTime] = useState('Instant');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const commonIssues = [
    { icon: RotateCcw, text: 'Password Reset', color: 'bg-blue-100 text-blue-700' },
    { icon: HelpCircle, text: 'Software Installation', color: 'bg-green-100 text-green-700' },
    { icon: AlertCircle, text: 'Network Problems', color: 'bg-red-100 text-red-700' },
    { icon: MessageCircle, text: 'Email Issues', color: 'bg-purple-100 text-purple-700' }
  ];

  useEffect(() => {
    initializeChat();
    loadRelatedArticles();
  }, [user?.id]);

  // If navigated with a search query from dashboard, auto-send it
  useEffect(() => {
    const stateQ = location?.state?.q;
    if (stateQ) {
      setTimeout(() => {
        setInputValue(stateQ);
        handleSendMessage(stateQ);
      }, 0);
    }
  }, [location?.state]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: 'welcome',
      type: 'bot',
      content: `Hi ${userProfile?.display_name || 'there'}! 👋 I'm your AI IT assistant. How can I help you today?`,
      timestamp: new Date()?.toISOString(),
      suggestions: [
        "I forgot my password",
        "My email isn\'t working",
        "I need help installing software",
        "I\'m having network issues"
      ]
    };
    setMessages([welcomeMessage]);
    generateSuggestions('');
  };

  const loadRelatedArticles = async () => {
    try {
      // Use n8n KB webhook if available
      if (appConfig?.n8nKbWebhookUrl) {
        const res = await fetch(appConfig?.n8nKbWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'kb_articles', source: 'employee_chat_sidebar', limit: 3 })
        });
        if (res?.ok) {
          const payload = await res.json();
          const items = Array.isArray(payload?.articles) ? payload?.articles : Array.isArray(payload) ? payload : [];
          if (items?.length) {
            setRelatedArticles(items?.slice(0, 3).map((a, idx) => ({
              id: a?.id || idx,
              title_en: a?.title || a?.name || 'Knowledge Article',
              summary_en: a?.summary || a?.description || '',
              view_count: a?.views || a?.view_count || null,
              url: a?.url || a?.link || null,
            })));
            return;
          }
        }
      }

      // Try CBO RSS/Atom feed if provided (client-side XML parse)
      if (appConfig?.cboRssFeedUrl) {
        const res = await fetch(appConfig?.cboRssFeedUrl);
        if (res?.ok) {
          const xmlText = await res.text();
          const parser = new DOMParser();
          const xml = parser.parseFromString(xmlText, 'application/xml');
          const items = Array.from(xml.querySelectorAll('item, entry')).slice(0, 3).map((node, idx) => ({
            id: node.querySelector('guid')?.textContent || node.querySelector('id')?.textContent || idx,
            title_en: node.querySelector('title')?.textContent?.trim() || 'Article',
            summary_en: node.querySelector('description')?.textContent?.trim() || node.querySelector('summary')?.textContent?.trim() || '',
            url: node.querySelector('link')?.getAttribute?.('href') || node.querySelector('link')?.textContent || null,
            view_count: null,
          }));
          if (items?.length) {
            setRelatedArticles(items);
            return;
          }
        }
      }

      // Fallback: Supabase
      const { data } = await supabase?.from('documents')?.select('id, title_en, summary_en, view_count, url')?.eq('status', 'published')?.order('view_count', { ascending: false })?.limit(3);
      setRelatedArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateSuggestions = (context) => {
    const allSuggestions = [
      "How do I reset my password?",
      "My computer is running slow",
      "I can\'t access shared folders",
      "Email won\'t sync on my phone",
      "How to install new software?",
      "VPN connection issues",
      "Printer is not working",
      "I need help with Microsoft Office"
    ];
    
    // Filter suggestions based on context or show random ones
    const filtered = context 
      ? allSuggestions?.filter(s => s?.toLowerCase()?.includes(context?.toLowerCase()))
      : allSuggestions?.slice(0, 4);
    
    setSuggestions(filtered?.slice(0, 4));
  };

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText?.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()?.toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Try n8n first; fallback to local simulated response
    try {
      const controller = new AbortController();
      const reply = await sendChatToN8n({
        message: messageText,
        userId: user?.id,
        conversationId,
        sessionId,
        userProfile,
        signal: controller.signal,
      });

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: reply?.content,
        timestamp: new Date()?.toISOString(),
        suggestions: Array.isArray(reply?.suggestions) ? reply?.suggestions : undefined,
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.warn('n8n reply failed, using local simulated response:', err?.message);
      const botResponse = generateBotResponse(messageText);
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
      generateSuggestions(messageText);
    }

    // Save conversation to database
    if (!conversationId) {
      createNewConversation();
    }
  };

  const createNewConversation = async () => {
    try {
      const sessionId = `session_${Date.now()}`;
      const { data } = await supabase?.from('llm_conversations')?.insert({
          session_id: sessionId,
          user_id: user?.id,
          conversation_title: `IT Support Chat - ${new Date()?.toLocaleDateString()}`,
          started_at: new Date()?.toISOString(),
          message_count: 1,
          metadata: { source: 'employee_chat_interface' }
        })?.select()?.single();
      
      setConversationId(data?.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const generateBotResponse = (userMessage) => {
    const message = userMessage?.toLowerCase();
    
    let response = '';
    let suggestions = [];

    if (message?.includes('password')) {
      response = "I can help you reset your password! Here's what you need to do:\n\n1. Go to the company login page\n2. Click 'Forgot Password'\n3. Enter your work email\n4. Check your email for the reset link\n5. Follow the instructions in the email\n\nIf you don't receive the email within 10 minutes, it might be in your spam folder. Need me to escalate this to IT support?";
      suggestions = ["I don't see the reset email", "How long does the reset take?", "I need help with something else"];
    } else if (message?.includes('email')) {
      response = "I can help troubleshoot email issues! Let me ask a few questions:\n\n• Are you using Outlook, Apple Mail, or webmail?\n• Is this for mobile or desktop?\n• What specific problem are you experiencing?\n\nCommon email fixes:\n1. Check your internet connection\n2. Try signing out and back in\n3. Clear your email app cache\n4. Verify your email settings\n\nWhat type of email problem are you having?";
      suggestions = ["Emails not syncing", "Can't send emails", "Missing emails", "Login issues"];
    } else if (message?.includes('software') || message?.includes('install')) {
      response = "I can guide you through software installation! Here's the general process:\n\n1. Check if you have admin rights\n2. Download from approved sources only\n3. Run the installer as administrator\n4. Follow the setup wizard\n5. Restart if prompted\n\n⚠️ **Important**: Only install software from our approved list. Unauthorized software can create security risks.\n\nWhat software do you need to install?";
      suggestions = ["Microsoft Office", "Adobe products", "Browser updates", "I need admin access"];
    } else if (message?.includes('network') || message?.includes('internet') || message?.includes('wifi')) {
      response = "Let's troubleshoot your network connection! Try these steps:\n\n1. **Check basics**: Are other devices working?\n2. **Restart**: Unplug router for 30 seconds, plug back in\n3. **Reconnect**: Forget and reconnect to WiFi\n4. **Update**: Check for network driver updates\n5. **Contact**: If still not working, I'll escalate to IT\n\nAre you connected via WiFi or ethernet cable?";
      suggestions = ["WiFi keeps disconnecting", "Very slow internet", "Can't connect to VPN", "Ethernet not working"];
    } else {
      response = "I understand you need IT support! While I work on understanding your specific issue, here are some quick things to try:\n\n• Have you tried restarting your computer?\n• Is the issue affecting just you or others too?\n• When did this problem start?\n\nI can help with common issues like passwords, email, software installation, and network problems. What seems to be the main issue you're facing?";
      suggestions = ["My computer is slow", "I need help with printing", "Shared drive access", "Account locked out"];
    }

    return {
      id: Date.now() + 1,
      type: 'bot',
      content: response,
      timestamp: new Date()?.toISOString(),
      suggestions: suggestions
    };
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  // Quick action handlers above the chat bar
  const handleExportPdf = () => {
    try {
      window?.print?.();
    } catch (e) {
      console.log('Export PDF not supported in this environment');
    }
  };

  const handleInfographics = () => {
    handleSendMessage('Create an infographic summarizing the key points from this IT support conversation.');
  };

  const handleHowToVideo = () => {
    handleSendMessage('Generate a how-to video with step-by-step instructions based on our current IT issue.');
  };

  const escalateToHuman = () => {
    const escalationMessage = {
      id: Date.now(),
      type: 'system',
      content: '🔄 Connecting you to a human IT specialist... Estimated wait time: 3-5 minutes',
      timestamp: new Date()?.toISOString()
    };
    setMessages(prev => [...prev, escalationMessage]);
    setWaitTime('3-5 min');
  };

  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    initializeChat();
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Main Chat Area - 75% */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (window?.history?.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/employee/it-support');
                  }
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">IT Assistant</h1>
                  <p className="text-sm text-gray-500">
                    Online • Avg response: {waitTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={escalateToHuman}
                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-sm font-medium"
              >
                Talk to Human
              </button>
              <button 
                onClick={startNewConversation}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                title="New Conversation"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages?.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I help you today?</h3>
              <p className="text-gray-600 mb-6">Choose from common issues below or describe your problem</p>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {commonIssues?.map((issue, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(issue?.text)}
                    className={`${issue?.color} px-4 py-3 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity flex items-center space-x-2`}
                  >
                    <issue.icon className="w-4 h-4" />
                    <span>{issue?.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages?.map((message) => (
            <div key={message?.id} className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl ${message?.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message?.type !== 'user' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message?.type === 'bot' ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      {message?.type === 'bot' ? (
                        <Bot className="w-4 h-4 text-blue-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {message?.type === 'bot' ? 'IT Assistant' : 'System'}
                    </span>
                  </div>
                )}
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message?.type === 'user' ?'bg-blue-600 text-white' 
                    : message?.type === 'system' ?'bg-yellow-50 text-yellow-800 border border-yellow-200' :'bg-gray-100 text-gray-900'
                }`}>
                  <div className="whitespace-pre-line text-sm">{message?.content}</div>
                </div>
                
                {message?.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message?.suggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-3xl">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">IT Assistant</span>
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 px-6 py-4">
          {/* Quick utilities above chat bar */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              title="Export conversation as PDF"
            >
              <FileDown className="w-4 h-4" />
              <span className="text-sm">Export PDF</span>
            </button>
            <button
              onClick={handleInfographics}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              title="Generate infographic"
            >
              <Image className="w-4 h-4" />
              <span className="text-sm">Infographics</span>
            </button>
            <button
              onClick={handleHowToVideo}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              title="Create how-to video"
            >
              <Video className="w-4 h-4" />
              <span className="text-sm">How to Video</span>
            </button>
          </div>
          <div className="flex items-end space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e?.target?.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your IT question here..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{minHeight: '48px', maxHeight: '120px'}}
              />
            </div>
            
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-full hover:bg-gray-100 ${
                isListening ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue?.trim()}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send • Shift + Enter for new line
          </div>
        </div>
      </div>
      {/* Sidebar - 25% */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Help Resources</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              {[
                'Reset my password',
                'My Outlook is not syncing',
                'Install approved software',
                'VPN connection issues',
                'Request access to shared drive',
              ]?.map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(label)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200 flex items-center justify-between"
                >
                  <span>{label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Related Articles</h4>
            </div>
            <div className="space-y-3">
              {relatedArticles?.map((article) => (
                <a key={article?.id} className="block border-l-2 border-blue-200 pl-3 hover:bg-blue-50/40 rounded" href={article?.url || '#'} target="_blank" rel="noreferrer">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {article?.title_en}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {article?.summary_en}
                  </p>
                  {article?.view_count != null && (
                    <p className="text-xs text-blue-600 mt-1">
                      {article?.view_count} views
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Need More Help?</h4>
            <div className="space-y-2">
              <button 
                onClick={escalateToHuman}
                className="w-full text-left px-3 py-2 text-sm bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-md border border-orange-200"
              >
                🙋‍♀️ Connect to IT Support
              </button>
              <a href="mailto:it-support@company.com" className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200">
                📧 Email IT Department
              </a>
              <a href="tel:+1234567890" className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md border border-gray-200">
                📞 Call IT Helpdesk
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}