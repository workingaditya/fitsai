import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KnowledgeCategoryCard = ({ category, userRole }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    if (category?.path) {
      navigate(category?.path);
    }
  };

  const handleQuickAction = (action, e) => {
    e?.stopPropagation();
    if (action?.path) {
      navigate(action?.path);
    }
  };

  const isAccessible = category?.roles?.includes(userRole);

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group ${
        !isAccessible ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/20'
      }`}
      onClick={isAccessible ? handleCategoryClick : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-primary`}>
          <Icon name={category?.icon} size={24} color="white" />
        </div>
        {category?.isNew && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
            New
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
        {category?.title}
      </h3>
      <p className="text-sm text-text-secondary mb-4 line-clamp-2">
        {category?.description}
      </p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Icon name="FileText" size={14} />
            <span>{category?.articleCount} articles</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{category?.lastUpdated}</span>
          </div>
        </div>
        {category?.priority && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            category?.priority === 'high' ? 'bg-error/10 text-error' :
            category?.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
          }`}>
            {category?.priority} priority
          </span>
        )}
      </div>
      {category?.quickActions && category?.quickActions?.length > 0 && (
        <div className="flex items-center space-x-2">
          {category?.quickActions?.slice(0, 2)?.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={(e) => handleQuickAction(action, e)}
              className="flex items-center space-x-1 text-xs"
              disabled={!isAccessible}
            >
              <Icon name={action?.icon} size={14} />
              <span>{action?.label}</span>
            </Button>
          ))}
        </div>
      )}
      {!isAccessible && (
        <div className="absolute inset-0 bg-muted/50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Icon name="Lock" size={24} className="text-text-secondary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">Access Restricted</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCategoryCard;