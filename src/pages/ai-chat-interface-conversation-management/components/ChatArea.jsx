import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import VideoGenerationModal from './VideoGenerationModal';

const ChatArea = ({ 
  conversation, 
  messages, 
  onSendMessage, 
  isTyping, 
  selectedModel,
  userRole = 'admin'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoModalContent, setVideoModalContent] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (messageContent) => {
    const content = messageContent || inputValue?.trim();
    if (!content || isTyping) return;

    // Validate that we have an active conversation
    if (!conversation) {
      console.error('No active conversation selected');
      return;
    }

    // Validate that onSendMessage is available
    if (!onSendMessage || typeof onSendMessage !== 'function') {
      console.error('onSendMessage function is not available');
      return;
    }
    
    try {
      // Check if user is requesting video content - Fixed with proper optional chaining
      const isVideoRequest = content?.toLowerCase()?.includes('video') || 
                            content?.toLowerCase()?.includes('how to') ||
                            content?.toLowerCase()?.includes('tutorial') ||
                            content?.toLowerCase()?.includes('convert to');

      await onSendMessage(content, { 
        contentType: isVideoRequest ? 'video' : 'text',
        generateVideo: isVideoRequest 
      });
      
      setInputValue('');
      if (textareaRef?.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      // Show user-friendly error message
      if (onSendMessage && typeof onSendMessage === 'function') {
        onSendMessage(`Error: ${error?.message}`, { isError: true });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey && !isComposing && !isTyping) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e?.target?.value);
    // Auto-resize textarea
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef?.current?.scrollHeight, 120) + 'px';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleVideoGenerated = (videoData) => {
    console.log('Video generated:', videoData);
    // You could add the video to messages or handle it differently
  };

  const openVideoModal = (content) => {
    setVideoModalContent(content);
    setVideoModalOpen(true);
  };

  const renderMessage = (message) => {
    if (message?.type === 'system') {
      return (
        <div key={message?.id} className="flex justify-center py-2">
          <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1 rounded-full">
            {message?.content}
          </div>
        </div>
      );
    }

    const isUser = message?.sender === 'user';
    const isStreaming = message?.isStreaming;
    const hasError = message?.isError || message?.error;
    const isVideoContent = message?.isVideoContent || message?.contentType === 'video';

    return (
      <div key={message?.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary text-primary-foreground' : 
            hasError ? 'bg-error/20': isVideoContent ?'bg-purple-500/20' : 'bg-accent/20'
          }`}>
            <Icon name={isUser ? 'User' : hasError ? 'AlertTriangle' : isVideoContent ? 'Video' : 'Bot'} size={16} />
          </div>

          {/* Message Content */}
          <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
            {/* Message Header for AI responses */}
            {!isUser && (
              <div className="flex items-center space-x-2 mb-1 text-xs text-muted-foreground">
                <span className="font-medium">
                  FITS AI {message?.model && `(${message?.model})`}
                </span>
                {message?.serviceType && (
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                    message?.serviceType === 'openai' ? 'bg-blue-500/20 text-blue-400' :
                    message?.serviceType === 'gemini'? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {message?.serviceType === 'openai' ? 'Cloud' : 
                     message?.serviceType === 'gemini' ? 'Gemini' : 'Local'}
                  </span>
                )}
                {isVideoContent && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">
                    <Icon name="Video" size={12} className="mr-1" />
                    Video Content
                  </span>
                )}
                {message?.responseTime && (
                  <span className="text-muted-foreground">
                    {message?.responseTime}ms
                  </span>
                )}
                {isStreaming && (
                  <span className="flex items-center space-x-1 text-accent">
                    <Icon name="Loader" size={12} className="animate-spin" />
                    <span>Generating...</span>
                  </span>
                )}
              </div>
            )}

            {/* Message Bubble */}
            <div className={`rounded-lg px-4 py-3 ${
              isUser 
                ? 'bg-primary text-primary-foreground' 
                : hasError
                ? 'bg-error/10 border border-error/20 text-foreground'
                : isVideoContent
                ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800/20 text-foreground'
                : 'bg-muted text-foreground'
            }`}>
              {/* Video Content Special Rendering */}
              {isVideoContent && !isUser && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 mb-3">
                    <Icon name="Video" size={18} />
                    <span className="font-semibold text-base">How-to Video Generated</span>
                  </div>
                  
                  {/* Improved Video Preview Card */}
                  <div className="bg-white dark:bg-gray-900/80 rounded-lg p-4 border border-purple-200 dark:border-purple-700/50 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Professional Tutorial Video</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Generated using Google Gemini (Veo Alternative)
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                          onClick={() => openVideoModal(message?.content)}
                        >
                          <Icon name="Eye" size={14} className="mr-1" />
                          View Video
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                          onClick={() => handleDownloadScript(message)}
                        >
                          <Icon name="Download" size={14} className="mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    {/* Video Preview Thumbnail */}
                    <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-md aspect-video flex items-center justify-center mb-3">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center mb-2">
                          <Icon name="Play" size={24} className="text-purple-600 dark:text-purple-400 ml-1" />
                        </div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          Click "View Video" to see full tutorial
                        </p>
                      </div>
                    </div>
                    
                    {/* Video Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Icon name="Clock" size={12} className="mr-1" />
                          ~5 min tutorial
                        </span>
                        <span className="flex items-center">
                          <Icon name="Monitor" size={12} className="mr-1" />
                          HD Quality
                        </span>
                      </div>
                      <span className="flex items-center text-purple-600 dark:text-purple-400">
                        <Icon name="Zap" size={12} className="mr-1" />
                        AI Generated
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {message?.content?.split('\n')?.map((line, index) => {
                  // Handle code blocks
                  if (line?.startsWith('```')) {
                    return null; // Handle separately
                  }
                  
                  // Handle bold text
                  if (line?.startsWith('**') && line?.endsWith('**')) {
                    return (
                      <p key={index} className="font-semibold mb-2">
                        {line?.slice(2, -2)}
                      </p>
                    );
                  }
                  
                  // Handle bullet points
                  if (line?.startsWith('• ') || line?.startsWith('- ')) {
                    return (
                      <li key={index} className="ml-4 mb-1">
                        {line?.slice(2)}
                      </li>
                    );
                  }
                  
                  // Handle numbered lists
                  if (line?.match(/^\d+\./)) {
                    return (
                      <p key={index} className="mb-1">
                        {line}
                      </p>
                    );
                  }
                  
                  // Regular paragraph
                  if (line?.trim()) {
                    return (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    );
                  }
                  
                  return <br key={index} />;
                })}
                
                {/* Render code blocks separately */}
                {message?.content?.includes('```') && (
                  <div className="mt-3">
                    {renderCodeBlocks(message?.content)}
                  </div>
                )}
                
                {/* Streaming cursor */}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                )}
              </div>

              {/* Error indicator */}
              {hasError && (
                <div className="mt-2 text-xs text-error flex items-center space-x-1">
                  <Icon name="AlertTriangle" size={12} />
                  <span>Response failed - please try again</span>
                </div>
              )}
            </div>

            {/* Message Footer */}
            <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
              <span>{formatTimestamp(message?.timestamp)}</span>
              {!isUser && !hasError && !isStreaming && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs hover:bg-muted/50"
                    onClick={() => handleCopyMessage(message?.content)}
                  >
                    <Icon name="Copy" size={12} className="mr-1" />
                    Copy
                  </Button>
                  {userRole === 'admin' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs hover:bg-muted/50"
                      onClick={() => handleRegenerateResponse(message)}
                    >
                      <Icon name="RotateCcw" size={12} className="mr-1" />
                      Regenerate
                    </Button>
                  )}
                  {isVideoContent && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs hover:bg-muted/50"
                      onClick={() => handleCreateStoryboard(message)}
                    >
                      <Icon name="Image" size={12} className="mr-1" />
                      Storyboard
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCodeBlocks = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let match;

    while ((match = codeBlockRegex?.exec(content)) !== null) {
      const language = match?.[1] || 'text';
      const code = match?.[2]?.trim();
      
      blocks?.push(
        <div key={blocks?.length} className="bg-slate-900 rounded-lg p-3 my-2 overflow-x-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase font-mono">{language}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-slate-400 hover:text-white"
              onClick={() => handleCopyCode(code)}
            >
              <Icon name="Copy" size={12} className="mr-1" />
              Copy
            </Button>
          </div>
          <pre className="text-sm text-slate-100 font-mono overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    return blocks;
  };

  const handleCopyMessage = async (content) => {
    try {
      // Remove markdown formatting for cleaner copy
      const cleanContent = content
        ?.replace(/\*\*(.*?)\*\*/g, '$1')
        ?.replace(/```[\w]*\n([\s\S]*?)```/g, '$1')
        ?.replace(/`(.*?)`/g, '$1');
      
      await navigator.clipboard?.writeText(cleanContent);
      console.log('Message copied to clipboard');
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard?.writeText(code);
      console.log('Code copied to clipboard');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleRegenerateResponse = (message) => {
    // Find the user message that prompted this AI response
    const messageIndex = messages?.findIndex(msg => msg?.id === message?.id);
    if (messageIndex > 0) {
      const userMessage = messages?.[messageIndex - 1];
      if (userMessage?.sender === 'user') {
        handleSendMessage(userMessage?.content);
      }
    }
  };

  const handleDownloadScript = async (message) => {
    try {
      const content = `# Video Script\n\n${message?.content}\n\nGenerated by FITS AI (${message?.model})\nTimestamp: ${new Date(message?.timestamp)?.toLocaleString()}`;
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `video-script-${Date.now()}.md`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Video script downloaded');
    } catch (error) {
      console.error('Failed to download script:', error);
    }
  };

  const handleCreateStoryboard = (message) => {
    const storyboardPrompt = `Create a visual storyboard for this video content: ${message?.content}`;
    handleSendMessage(storyboardPrompt, { contentType: 'storyboard' });
  };

  const handleConvertToVideo = async () => {
    if (!inputValue?.trim() && !conversation) return;
    
    try {
      // Validate that onSendMessage is available
      if (!onSendMessage || typeof onSendMessage !== 'function') {
        console.error('onSendMessage function is not available for video conversion');
        return;
      }

      // Get the last AI response from messages
      const lastAIMessage = messages
        ?.filter(msg => msg?.sender === 'ai' && !msg?.isError)
        ?.pop();
      
      if (lastAIMessage?.content) {
        const videoPrompt = `Convert this IT response into a professional step-by-step how-to video tutorial: ${lastAIMessage?.content}`;
        
        // Send as video generation request using Gemini (Google Veo alternative)
        await onSendMessage(videoPrompt, { 
          contentType: 'video',
          generateVideo: true,
          videoType: 'howto',
          videoEngine: 'gemini' // Force Gemini usage for video generation
        });
      } else {
        // If no previous AI response, use current input
        const videoPrompt = `Create a professional how-to video tutorial for IT professionals about: ${inputValue?.trim()}`;
        await onSendMessage(videoPrompt, { 
          contentType: 'video',
          generateVideo: true,
          videoType: 'howto',
          videoEngine: 'gemini' // Force Gemini usage for video generation
        });
      }
    } catch (error) {
      console.error('Error converting to video with Gemini:', error);
      // Use onSendMessage to handle error instead of setMessages
      if (onSendMessage && typeof onSendMessage === 'function') {
        onSendMessage(`I encountered an error while generating the video with Google Gemini (Veo alternative): ${error?.message}. Please try again.`, { isError: true });
      }
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="MessageSquare" size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Welcome to FITS AI Assistant
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Select a conversation from the sidebar or start a new chat to get technical guidance and troubleshooting support.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground">
              <Icon name="Shield" size={12} className="mr-1" />
              Security Procedures
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground">
              <Icon name="Wifi" size={12} className="mr-1" />
              Network Troubleshooting
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-muted text-muted-foreground">
              <Icon name="Server" size={12} className="mr-1" />
              System Administration
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon 
                name={conversation?.category === 'security' ? 'Shield' : 
                      conversation?.category === 'network' ? 'Wifi' :
                      conversation?.category === 'system' ? 'Server' : 'MessageSquare'} 
                size={20} 
                className="text-muted-foreground" 
              />
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">
                  {conversation?.title}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Model: {selectedModel}</span>
                  <span>•</span>
                  <span className={`inline-flex items-center ${
                    conversation?.status === 'resolved' ? 'text-success' :
                    conversation?.status === 'active'? 'text-accent' : 'text-warning'
                  }`}>
                    <Icon name="Circle" size={8} className="mr-1 fill-current" />
                    {conversation?.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                title="Export Conversation"
              >
                <Icon name="Download" size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Share Conversation"
              >
                <Icon name="Share" size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="More Options"
              >
                <Icon name="MoreVertical" size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
          <div className="max-w-4xl mx-auto">
            {messages?.map(renderMessage)}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <Icon name="Bot" size={16} color="white" />
                    </div>
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="Ask about network issues, security procedures, system configurations..."
                  className="w-full px-4 py-3 pr-12 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[44px] max-h-[120px]"
                  rows={1}
                />
                <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    title="Attach File"
                  >
                    <Icon name="Paperclip" size={14} />
                  </Button>
                </div>
              </div>
              <Button
                variant="default"
                onClick={handleSendMessage}
                disabled={!inputValue?.trim() || isTyping}
                iconName="Send"
                iconSize={16}
                className="h-11"
              >
                Send
              </Button>
            </div>
            
            {/* Keyboard Shortcuts */}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>•</span>
                <span>Ctrl+M to switch models</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Zap" size={12} />
                <span>AI-powered responses</span>
              </div>
            </div>
            
            {/* Convert to Video Button */}
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvertToVideo}
                disabled={isTyping}
                className="flex items-center space-x-2 h-9 px-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800/30 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 transition-all duration-200"
                title="Generate a how-to video tutorial using Google Gemini (Veo alternative)"
              >
                <Icon name="Video" size={16} className="text-purple-600 dark:text-purple-400" />
                <span className="font-medium">Convert to How-to Video</span>
                <span className="text-xs opacity-75 ml-1">(Powered by Gemini)</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Generation Modal */}
      <VideoGenerationModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        content={videoModalContent}
        onVideoGenerated={handleVideoGenerated}
        initialPrompt={inputValue}
      />
    </>
  );
};

export default ChatArea;