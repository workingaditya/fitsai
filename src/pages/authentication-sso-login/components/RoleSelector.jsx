import React from 'react';
import Icon from '../../../components/AppIcon';


const RoleSelector = ({ selectedRole, onRoleSelect }) => {
  const roles = [
    {
      id: 'admin',
      name: 'IT Administrator',
      description: 'Full system access and management',
      icon: 'Shield',
      color: 'text-primary'
    },
    {
      id: 'support',
      name: 'Support Specialist',
      description: 'Help desk and user support',
      icon: 'Headphones',
      color: 'text-accent'
    },
    {
      id: 'security',
      name: 'Security Analyst',
      description: 'Security monitoring and compliance',
      icon: 'Lock',
      color: 'text-warning'
    },
    {
      id: 'employee',
      name: 'Employee',
      description: 'Request IT help and support',
      icon: 'User',
      color: 'text-success'
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-foreground mb-3">Select Your Role</h3>
      <div className="grid grid-cols-1 gap-2">
        {roles?.map((role) => (
          <button
            key={role?.id}
            onClick={() => onRoleSelect(role?.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:border-primary/50 ${
              selectedRole === role?.id
                ? 'border-primary bg-primary/5' :'border-border bg-card hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${role?.color}`}>
                <Icon name={role?.icon} size={16} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{role?.name}</p>
                <p className="text-xs text-muted-foreground">{role?.description}</p>
              </div>
              {selectedRole === role?.id && (
                <Icon name="CheckCircle" size={16} className="text-primary" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;