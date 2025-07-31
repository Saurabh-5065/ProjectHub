import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarDays, MoreHorizontal } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import type { MyProject, ProjectPriority } from '../../types';

interface ProjectCardProps {
  project: MyProject;
}

const getPriorityBadgeVariant = (
  priority: ProjectPriority
): 'default' | 'destructive' | 'secondary' | 'outline' => {
  switch (priority) {
    case 'High':
      return 'destructive';
    case 'Critical':
      return 'destructive';
    case 'Medium':
      return 'default';
    case 'Low':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getPriorityBgColor = (priority: ProjectPriority): string => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Critical':
      return 'bg-pink-100 text-pink-700 border-pink-200';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Low':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusBadgeVariant = (
  status: MyProject['status']
): 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case 'In Progress':
      return 'default';
    case 'Near Completion':
      return 'secondary';
    case 'Completed':
      return 'outline';
    case 'On Hold':
      return 'secondary';
    case 'Planning':
      return 'outline';
    default:
      return 'secondary';
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Link to={`/projects/${project.id}`} className="hover:underline">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {project.name}
            </CardTitle>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/projects/${project.id}`}>View/Edit Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Archive Project</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge
          variant="outline"
          className={`text-xs font-medium px-2 py-0.5 mt-1 self-start ${getPriorityBgColor(project.priority)}`}
        >
          {project.priority}
        </Badge>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {project.description || 'No description available'}
        </p>
        <div className="mb-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-gray-700">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start space-y-3 pt-4 border-t border-gray-200">
        <div className="flex justify-between w-full text-xs text-gray-500">
          <div className="flex items-center space-x-1.5">
            <Users size={14} />
            <span>{project.members.length} members</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CalendarDays size={14} />
            <span>{project.dueDate}</span>
          </div>
        </div>
        <Badge
          variant={getStatusBadgeVariant(project.status)}
          className="w-full justify-center py-1 text-xs"
        >
          {project.status}
        </Badge>
      </CardFooter>
    </Card>
  );
};
