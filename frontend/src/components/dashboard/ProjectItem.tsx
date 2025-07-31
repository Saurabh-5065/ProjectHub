// src/components/dashboard/ProjectItem.tsx

import React from 'react';
import type { Project } from '../../types'; // Adjusted path
import { Users, CalendarClock } from 'lucide-react';
// Shadcn UI Progress and Badge:
// `npx shadcn-ui@latest add progress`
// `npx shadcn-ui@latest add badge`
import { Progress } from '../ui/progress'; // Adjusted path
import { Badge } from '../ui/badge'; // Adjusted path

interface ProjectItemProps {
  project: Project;
}

const getStatusBadgeVariant = (
  status: Project['status']
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'In Progress':
      return 'default';
    case 'Near Completion':
      return 'secondary'; // You might want a different color, check Shadcn variants
    case 'Completed':
      return 'outline'; // Typically green, but depends on your theme. Shadcn 'success' variant if customized.
    default:
      return 'secondary';
  }
};

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{project.name}</h3>
        <Badge
          variant={getStatusBadgeVariant(project.status)}
          className="text-xs"
        >
          {project.status}
        </Badge>
      </div>
      <div className="mb-3">
        <Progress value={project.progress} className="h-2" />{' '}
        {/* `Progress` from shadcn/ui */}
        <p className="text-xs text-gray-500 mt-1">
          {project.progress}% complete
        </p>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Users size={14} />
          <span>{project.members} members</span>
        </div>
        <div className="flex items-center space-x-1">
          <CalendarClock size={14} />
          <span>{project.dueDate}</span>
        </div>
      </div>
    </div>
  );
};
