// src/components/dashboard/ActivityItem.tsx

import React from 'react';
import type { Activity } from '../../types';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'; // Adjusted path

interface ActivityItemProps {
  activity: Activity;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const initials = activity.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-200 last:border-b-0">
      <Avatar className="h-9 w-9">
        {activity.user.avatarUrl ? (
          <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
        ) : (
          <AvatarFallback>{initials}</AvatarFallback> // `AvatarFallback` from shadcn/ui
        )}
      </Avatar>
      <div>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{activity.user.name}</span>{' '}
          {activity.action}
        </p>
        <p className="text-xs text-gray-500">{activity.timestamp}</p>
      </div>
    </div>
  );
};
