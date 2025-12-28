// // src/components/dashboard/DashboardOverview.tsx

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Briefcase, CheckCircle2, Users2, FastForward } from 'lucide-react';

// import { StatCard } from './StatCard';
// import { ProjectItem } from './ProjectItem';
// import { ActivityItem } from './ActivityItem';

// import type { StatCardItem, Project, Activity } from '../../types';
// import { useAuth } from '../../context/AuthContext'; // Custom auth context hook

// export const DashboardOverview: React.FC = () => {
//   useAuth(); // Assuming this gives you the logged-in user

//   const [statCardsData, setStatCardsData] = useState<StatCardItem[]>([]);
//   const [recentProjects, setRecentProjects] = useState<Project[]>([]);
//   const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const res = await axios.get('http://localhost:8000/api/dashboard', {
//           withCredentials: true, //  This sends the cookie
//         });

//         const { stats, recentProjects, recentActivity } = res.data;

//         const cards: StatCardItem[] = [
//           {
//             title: 'Active Projects',
//             value: stats.activeProjects,
//             change: '+2 from last month',
//             icon: Briefcase,
//             iconColor: 'text-blue-500',
//           },
//           {
//             title: 'Completed Tasks',
//             value: stats.completedTasks,
//             change: '+15 from last week',
//             icon: CheckCircle2,
//             iconColor: 'text-green-500',
//           },
//           {
//             title: 'Team Members',
//             value: stats.teamMembers,
//             change: '+3 new members',
//             icon: Users2,
//             iconColor: 'text-purple-500',
//           },
//           {
//             title: 'Pending Reviews',
//             value: stats.pendingReviews,
//             change: 'Due this week',
//             icon: FastForward,
//             iconColor: 'text-orange-500',
//           },
//         ];

//         setStatCardsData(cards);
//         setRecentProjects(recentProjects);
//         setRecentActivity(recentActivity);
//       } catch (error) {
//         console.error('Dashboard fetch error:', error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   return (
//     <>
//       <div className="flex justify-end items-center mb-6">
//         <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-100 px-3 py-1.5 rounded-full">
//           <span className="block h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse"></span>
//           <span>All systems operational</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {statCardsData.map((stat) => (
//           <StatCard key={stat.title} item={stat} />
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Recent Projects
//           </h2>
//           <div className="space-y-4">
//             {recentProjects.map((project) => (
//               <ProjectItem key={project._id} project={project} />
//             ))}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Recent Activity
//           </h2>
//           <div className="space-y-1">
//             {recentActivity.map((activity) => (
//               <ActivityItem key={activity._id} activity={activity} />
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
