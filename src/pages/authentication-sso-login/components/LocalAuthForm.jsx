import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LocalAuthForm = ({ onLocalLogin, isLoading, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials for quick login
  const demoCredentials = {
    admin: { username: 'admin@company.com', password: 'Admin123!' },
    employee: { username: 'employee@company.com', password: 'Employee123!' },
    support: { username: 'support@company.com', password: 'Support123!' }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (formData?.username && formData?.password) {
      onLocalLogin(formData);
    }
  };

  const handleDemoLogin = (role) => {
    const credentials = demoCredentials?.[role];
    setFormData(credentials);
    // Allow quick login without enforcing password check in demo mode; AuthContext will bypass Supabase
    onLocalLogin(credentials);
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 h-px bg-border"></div>
        <span className="text-sm text-muted-foreground">Email & Password</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      {/* Quick Demo Login Buttons */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-xs font-medium text-blue-800 mb-2">Quick Demo Login:</p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('admin')}
            disabled={isLoading}
            className="text-xs"
          >
            Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('employee')}
            disabled={isLoading}
            className="text-xs"
          >
            Employee
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('support')}
            disabled={isLoading}
            className="text-xs"
          >
            Support
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            name="username"
            placeholder="Email address"
            value={formData?.username}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            className="w-full"
          />
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData?.password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={!formData?.username || !formData?.password || isLoading}
          className="h-11"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Additional Authentication Options */}
      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          className="text-primary hover:text-primary/80 transition-colors"
          disabled={isLoading}
        >
          Forgot Password?
        </button>
        <button
          type="button"
          className="text-primary hover:text-primary/80 transition-colors"
          disabled={isLoading}
        >
          Need Help?
        </button>
      </div>

      {/* Connection Status */}
      {/* Hide Supabase status in demo */}
    </div>
  );
};

export default LocalAuthForm;