// src/types/index.ts

export interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  isActive?: boolean;
}

export interface StatCardItem {
  title: string;
  value: number | string;
  change?: string;
  icon: React.ElementType;
  iconColor?: string;
}

//export type ProjectPriority = 'High' | 'Medium' | 'Low' | 'Urgent'; // Added Urgent as an example

export interface Project {
  _id: string;
  name: string;
  members: number;
  dueDate: string;
  progress: number; // 0  to 100
  status: 'In Progress' | 'Near Completion' | 'Completed';
}

export interface Activity {
  _id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  action: string;
  timestamp: string;
}

//export type ProjectPriority = 'High' | 'Medium' | 'Low' | 'Urgent'; // Added Urgent as an example

// export interface MyProject {
//   id: string;
//   name: string;
//   priority: ProjectPriority; // New field
//   description: string;      // New field
//   members: number;
//   dueDate: string;
//   progress: number; // 0 to 100
//   status: 'In Progress' | 'Near Completion' | 'Completed' | 'On Hold' | 'Planning'; // Added Planning
// }

// types.ts
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical'; // Define all possible priorities

export interface TeamMember {
  id: string;
  username: string;
  email: string;
}

export interface TeamLead {
  id: string;
  username: string;
  email: string;
}

export interface MyProject {
  id: string;
  name: string;
  priority: ProjectPriority;
  description: string;
  members: TeamMember[]; // Changed from number to array of TeamMember
  dueDate: string;
  progress: number;
  status:
    | 'In Progress'
    | 'Near Completion'
    | 'Completed'
    | 'On Hold'
    | 'Planning';
  teamLead: TeamLead;
  createdAt: string;
  updatedAt: string;
}
