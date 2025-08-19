import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


export default function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  linkTo, 
  actionText, 
  colorClass = 'bg-blue-100 text-blue-600',
  onClick 
}) {
  const CardContent = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 group">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 ${colorClass?.replace('text-', 'text-')?.replace('bg-', 'bg-')} rounded-lg flex items-center justify-center group-hover:opacity-90 transition-colors`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 ml-4">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-sm font-medium" style={{color: colorClass?.includes('blue') ? '#2563eb' : colorClass?.includes('green') ? '#059669' : colorClass?.includes('orange') ? '#d97706' : '#7c3aed'}}>
        {actionText} →
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        <CardContent />
      </button>
    );
  }

  if (linkTo) {
    return (
      <Link to={linkTo}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}