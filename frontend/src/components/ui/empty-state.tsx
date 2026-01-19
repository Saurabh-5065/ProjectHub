// components/ui/empty-state.tsx
import React from 'react';
import { Frown } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = <Frown className="w-10 h-10 text-gray-400" />, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-white shadow-sm border border-gray-100 max-w-md mx-auto">
      <div className="mb-4 p-4 bg-gray-50 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action && action}
    </div>
  );
};