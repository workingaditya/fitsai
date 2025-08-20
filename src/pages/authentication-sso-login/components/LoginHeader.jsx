import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-primary rounded-xl shadow-md flex items-center justify-center mr-3">
          <Icon name="Zap" size={24} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">FITS AI</h1>
          <p className="text-sm text-text-secondary">IT Knowledge Assistant</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Enterprise Authentication
      </h2>
      <p className="text-text-secondary text-sm">
        Secure access for IT professionals
      </p>
    </div>
  );
};

export default LoginHeader;