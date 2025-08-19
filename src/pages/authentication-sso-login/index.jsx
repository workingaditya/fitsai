import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginHeader from './components/LoginHeader';
import RoleSelector from './components/RoleSelector';
import SSOProviders from './components/SSOProviders';
import LocalAuthForm from './components/LocalAuthForm';
import MFAModal from './components/MFAModal';
import SystemStatus from './components/SystemStatus';
import SecurityNotices from './components/SecurityNotices';
import Icon from '../../components/AppIcon';


const AuthenticationSSOLogin = () => {
  const navigate = useNavigate();
  const { signIn, loading, error, user, isAdmin, isEmployee, clearError } = useAuth();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [isLoading, setIsLoading] = useState(null);
  const [authError, setAuthError] = useState('');
  const [showMFA, setShowMFA] = useState(false);
  const [mfaMethod, setMfaMethod] = useState('app');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Updated mock credentials that work with Supabase auth
  const mockCredentials = {
    admin: { username: 'admin@company.com', password: 'Admin123!' },
    support: { username: 'support@company.com', password: 'Support123!' },
    security: { username: 'security@company.com', password: 'Security123!' },
    employee: { username: 'employee@company.com', password: 'Employee123!' }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      if (isAdmin()) {
        navigate('/admin/users');
      } else if (isEmployee()) {
        navigate('/employee/dashboard');
      }
    }
  }, [user, loading, navigate, isAdmin, isEmployee]);

  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setTimeout(() => setLockoutTime(lockoutTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (lockoutTime === 0 && isLocked) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [isLocked, lockoutTime]);

  // Clear errors when switching roles
  useEffect(() => {
    clearError();
    setAuthError('');
  }, [selectedRole, clearError]);

  const handleSSOLogin = async (providerId) => {
    setIsLoading(providerId);
    setAuthError('');

    // Show helpful message for unsupported providers
    setAuthError(`SSO Provider "${providerId}" requires configuration in your Supabase project. Please use email/password authentication for the demo.`);
    setIsLoading(null);
  };

  const handleLocalLogin = async (credentials) => {
    if (isLocked) {
      setAuthError(`Account locked. Try again in ${lockoutTime} seconds.`);
      return;
    }

    setIsLoading('local');
    setAuthError('');
    clearError();

    try {
      const result = await signIn({
        email: credentials?.username,
        password: credentials?.password
      });
      
      if (result?.error) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setLockoutTime(300); // 5 minutes lockout
          setAuthError('Too many failed attempts. Account locked for 5 minutes.');
        } else {
          // Show more helpful error messages
          let errorMessage = result?.error?.message;
          if (errorMessage?.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          }
          setAuthError(`${errorMessage}. ${3 - newAttempts} attempts remaining.`);
        }
      } else if (result?.user) {
        // Successful authentication
        setLoginAttempts(0);
        
        // Show success message briefly
        setAuthError('');
        
        // The useEffect will handle the redirect based on user role
      }
    } catch (err) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockoutTime(300);
        setAuthError('Too many failed attempts. Account locked for 5 minutes.');
      } else {
        let errorMessage = err?.message;
        if (errorMessage?.includes('Failed to fetch') || 
            errorMessage?.includes('AuthRetryableFetchError')) {
          errorMessage = 'Cannot connect to authentication service. Please check your internet connection or contact support.';
        }
        setAuthError(`${errorMessage}. ${3 - newAttempts} attempts remaining.`);
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleMFAVerify = async (code) => {
    try {
      // Simulate MFA verification for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (code === '123456') {
        setShowMFA(false);
        
        // Navigate based on actual user role from context
        if (isAdmin()) {
          navigate('/admin/users');
        } else if (isEmployee()) {
          navigate('/employee/dashboard');
        } else {
          navigate('/employee/dashboard'); // Default fallback
        }
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (err) {
      setAuthError('Invalid verification code. Please try again.');
    }
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setAuthError('');
    clearError();
    setLoginAttempts(0);
    setIsLocked(false);
  };

  // Show current error from AuthContext or local error
  const displayError = error || authError;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <LoginHeader />
          
          <RoleSelector 
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
          />

          <SSOProviders 
            onSSOLogin={handleSSOLogin}
            isLoading={isLoading}
          />

          <LocalAuthForm 
            onLocalLogin={handleLocalLogin}
            isLoading={isLoading || loading}
            error={displayError}
          />

          {/* Enhanced Error Display */}
          {displayError && (
            <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-error">{displayError}</p>
                  {displayError?.includes('Supabase project may be paused') && (
                    <div className="mt-2 text-xs text-error/80">
                      <p>Please check your Supabase dashboard and ensure your project is active.</p>
                      <button 
                        className="text-error underline hover:no-underline mt-1"
                        onClick={() => window?.open('https://supabase.com/dashboard/projects', '_blank')}
                      >
                        Open Supabase Dashboard
                      </button>
                    </div>
                  )}
                </div>
                {/* Copy Error Button */}
                <button
                  onClick={() => {
                    navigator?.clipboard?.writeText(displayError);
                    // You could add a toast notification here
                  }}
                  className="text-error/60 hover:text-error"
                  title="Copy error message"
                >
                  <Icon name="Copy" size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Updated Demo Credentials Display */}
          <div className="mt-6 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs font-medium text-foreground mb-2">Demo Credentials (Requires Supabase Users):</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Employee:</strong> employee@company.com / Employee123!</p>
              <p><strong>Admin:</strong> admin@company.com / Admin123!</p>
              <p><strong>Support:</strong> support@company.com / Support123!</p>
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                <p className="text-xs">
                  ⚠️ These users must exist in your Supabase auth.users table for authentication to work.
                </p>
                <p className="text-xs mt-1">
                  You can create them via Supabase dashboard or use the signup functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-800 mb-1">After Login Routes:</p>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>Employee:</strong> /employee/dashboard</p>
              <p><strong>Admin:</strong> /admin/users</p>
            </div>
          </div>
        </div>

        <SystemStatus />
        <SecurityNotices />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date()?.getFullYear()} FITS AI Enterprise. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <button className="text-xs text-primary hover:text-primary/80">
              Privacy Policy
            </button>
            <button className="text-xs text-primary hover:text-primary/80">
              Terms of Service
            </button>
            <button className="text-xs text-primary hover:text-primary/80">
              Support
            </button>
          </div>
        </div>
      </div>
      {/* MFA Modal */}
      <MFAModal
        isOpen={showMFA}
        onClose={() => setShowMFA(false)}
        onVerify={handleMFAVerify}
        method={mfaMethod}
      />
    </div>
  );
};

export default AuthenticationSSOLogin;