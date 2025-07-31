// src/components/dashboard/StatCard.tsx

import React from 'react';
import type { StatCardItem } from '../../types'; // Adjusted path
// Adjusted path
// Shadcn UI Card: Ensure you have this component from `npx shadcn-ui@latest add card`
// The path below assumes shadcn-ui places 'ui' components in 'src/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface StatCardProps {
  item: StatCardItem;
}

export const StatCard: React.FC<StatCardProps> = ({ item }) => {
  const IconComponent = item.icon;
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {item.title}
        </CardTitle>
        <IconComponent
          size={20}
          className={item.iconColor || 'text-gray-500'}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{item.value}</div>
        {item.change && (
          <p
            className={`text-xs ${item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}
          >
            {item.change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
