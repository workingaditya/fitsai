import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { appConfig } from '../../config';
import { 
  MessageCircle, 
  Search, 
  HelpCircle, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  LogOut,
  Bell
} from 'lucide-react';

export default function EmployeeITSupportPortal() {
  const { user, userProfile, signOut } = useAuth();
  const [requests, setRequests] = useState([]);
  const [systemStatus, setSystemStatus] = useState('operational');
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'my'

  // Help request form state
  const [form, setForm] = useState({
    category: 'access',
    subject: '',
    description: '',
    urgency: 'normal',
    attachments: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticketToast, setTicketToast] = useState('');

  useEffect(() => {
    loadEmployeeData();
  }, [user?.id]);

  const loadEmployeeData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Load user's conversation history as "requests"
      const { data: conversations } = await supabase?.from('llm_conversations')?.select('*')?.eq('user_id', user?.id)?.order('started_at', { ascending: false })?.limit(5);
      
      setRequests(conversations || []);
      
      // Load recent knowledge base articles
      const { data: documents } = await supabase?.from('documents')?.select('title_en, updated_at, view_count')?.eq('status', 'published')?.order('updated_at', { ascending: false })?.limit(3);
      
      setRecentActivity(documents || []);
      
    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocalTicket = (ticket) => {
    try {
      const key = `it_tickets_${user?.id || 'guest'}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(ticket);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
  };

  const loadLocalTickets = () => {
    try {
      const key = `it_tickets_${user?.id || 'guest'}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
  };

  const submitHelpRequest = async (e) => {
    e?.preventDefault?.();
    if (!form?.subject?.trim() || !form?.description?.trim()) return;

    setSubmitting(true);
    setTicketToast('');

    const payload = {
      user: { id: user?.id, email: user?.email, name: userProfile?.display_name },
      category: form?.category,
      subject: form?.subject,
      description: form?.description,
      urgency: form?.urgency,
      ts: new Date()?.toISOString(),
      source: 'employee_it_support_portal'
    };

    try {
      // Prefer n8n webhook if configured
      if (appConfig?.n8nTicketWebhookUrl) {
        const res = await fetch(appConfig?.n8nTicketWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create_ticket', ...payload })
        });
        if (res?.ok) {
          const data = await res.json().catch(() => ({}));
          const ticketId = data?.ticketId || data?.id || `TKT-${Date.now()}`;
          setTicketToast(`Help request submitted. Ticket #${ticketId}`);
          saveLocalTicket({ id: ticketId, ...payload, status: 'open' });
          setForm({ category: 'access', subject: '', description: '', urgency: 'normal', attachments: [] });
          setActiveTab('my');
          return;
        }
      }

      // Fallback: store in Supabase if available
      try {
        const { data, error } = await supabase?.from('it_tickets')?.insert({
          user_id: user?.id,
          category: payload?.category,
          subject: payload?.subject,
          description: payload?.description,
          urgency: payload?.urgency,
          status: 'open',
          created_at: payload?.ts
        })?.select()?.single();
        if (!error && data) {
          setTicketToast(`Help request submitted. Ticket #${data?.id}`);
          saveLocalTicket({ id: data?.id, ...payload, status: 'open' });
          setForm({ category: 'access', subject: '', description: '', urgency: 'normal', attachments: [] });
          setActiveTab('my');
          return;
        }
      } catch {}

      // Last resort: local-only persistence
      const localId = `TKT-${Date.now()}`;
      saveLocalTicket({ id: localId, ...payload, status: 'open' });
      setTicketToast(`Help request submitted. Ticket #${localId}`);
      setForm({ category: 'access', subject: '', description: '', urgency: 'normal', attachments: [] });
      setActiveTab('my');
    } catch (err) {
      setTicketToast(`Submission failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => setTicketToast(''), 4000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertCircle className="w-4 h-4" />;
      case 'down': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString)?.toLocaleDateString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your support portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-semibold text-gray-900">IT Support Portal</h1>
              </div>
              <div className="hidden md:block">
                <div className={`flex items-center space-x-2 ${getStatusColor(systemStatus)}`}>
                  {getStatusIcon(systemStatus)}
                  <span className="text-sm font-medium">
                    IT Services: {systemStatus?.charAt(0)?.toUpperCase() + systemStatus?.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userProfile?.display_name || user?.email?.split('@')?.[0] || 'Employee'}
                </span>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-500"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to IT Support</h2>
          <p className="text-gray-600">Get help with your IT questions and issues quickly and easily.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Actions - Takes 3/4 width */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Ask IT Question */}
              <Link 
                to="/employee-chat-support-interface"
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-4">Ask IT Question</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Chat with our AI assistant for instant help with common IT issues.
                </p>
                <div className="text-sm text-blue-600 font-medium">
                  Average response time: Instant →
                </div>
              </Link>

              {/* Search Knowledge Base */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-4">Search Knowledge Base</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Find answers in our comprehensive IT knowledge base.
                </p>
                <div className="text-sm text-green-600 font-medium">
                  500+ articles available →
                </div>
              </div>

              {/* Submit Help Request */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <HelpCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-4">Submit Help Request</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Create a formal ticket for complex issues requiring human support.
                </p>
                <div className="text-sm text-orange-600 font-medium">
                  Avg resolution: 2-4 hours →
                </div>
              </div>

              {/* My Requests */}
              <Link 
                to="#my-requests" 
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 ml-4">My Requests</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Track the status of your support requests and chat history.
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  {requests?.length || 0} active conversations →
                </div>
              </Link>
            </div>

            {/* Tabs: Submit Help Request | My Requests */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 pt-4">
                <div className="flex items-center space-x-4 border-b border-gray-200">
                  <button onClick={() => setActiveTab('submit')} className={`px-3 py-2 text-sm font-medium ${activeTab==='submit'?'text-blue-600 border-b-2 border-blue-600':'text-gray-600 hover:text-gray-800'}`}>Submit Help Request</button>
                  <button onClick={() => setActiveTab('my')} className={`px-3 py-2 text-sm font-medium ${activeTab==='my'?'text-blue-600 border-b-2 border-blue-600':'text-gray-600 hover:text-gray-800'}`}>My Requests</button>
                </div>
              </div>

              {ticketToast && (
                <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                  {ticketToast}
                </div>
              )}

              {/* Submit tab */}
              {activeTab === 'submit' && (
                <form onSubmit={submitHelpRequest} className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                      <option value="access">Access Request</option>
                      <option value="hardware">Hardware Issue</option>
                      <option value="software">Software Issue</option>
                      <option value="network">Network Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input value={form.subject} onChange={(e)=>setForm({...form, subject:e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Brief summary of the issue" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-[120px]" placeholder="Provide details, error messages, steps to reproduce" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                    <div className="flex items-center space-x-3 text-sm">
                      {['low','normal','high','critical'].map(u => (
                        <label key={u} className="inline-flex items-center space-x-1">
                          <input type="radio" name="urgency" value={u} checked={form.urgency===u} onChange={(e)=>setForm({...form, urgency:e.target.value})} />
                          <span className="capitalize">{u}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300">
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              )}

              {/* My Requests tab */}
              {activeTab === 'my' && (
                <div id="my-requests" className="divide-y divide-gray-200">
                  {(() => {
                    const local = loadLocalTickets();
                    const items = [
                      ...local,
                      ...((requests || []).map(r => ({ id: r?.id, subject: r?.conversation_title, status: r?.ended_at ? 'closed' : 'open', created_at: r?.started_at })))
                    ];
                    if (items.length === 0) {
                      return (
                        <div className="px-6 py-8 text-center">
                          <p className="text-gray-500">No requests yet.</p>
                          <p className="text-sm text-gray-400 mt-1">Submit a help request to see it here.</p>
                        </div>
                      );
                    }
                    return items.slice(0, 10).map((t) => (
                      <div key={t?.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {t?.subject || `Ticket ${String(t?.id).slice(-6)}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created {formatDate(t?.created_at)} • Status: <span className="capitalize">{t?.status || 'open'}</span>
                            </p>
                          </div>
                          <div className="flex items-center">
                            {t?.status === 'closed' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Sidebar - Takes 1/4 width */}
          <div className="space-y-6">
            {/* IT Availability Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">IT Support Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Chat Support</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Support</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-500">2h avg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phone Support</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-xs text-gray-500">Busy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Knowledge Articles */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Recently Updated</h4>
              <div className="space-y-3">
                {recentActivity?.length > 0 ? (
                  recentActivity?.map((article, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-3">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {article?.title_en}
                      </p>
                      <p className="text-xs text-gray-500">
                        Updated {formatDate(article?.updated_at)} • {article?.view_count} views
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent updates.</p>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                  • Password Reset Guide
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                  • Software Installation
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                  • Network Troubleshooting
                </a>
                <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                  • Email Setup
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}