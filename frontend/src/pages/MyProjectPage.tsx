import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Plus, Search, Frown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ProjectCard } from '../components/projects/ProjectCard';
import { EmptyState } from '../components/ui/empty-state';
import { Skeleton } from '../components/ui/skeleton';
import type { MyProject } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const MyProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<MyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/myProjects', {
          withCredentials: true,
        });

        console.log('API Response:', res.data); // Debug log

        if (res.data?.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((proj: any) => ({
            id: proj._id,
            name: proj.name,
            priority: proj.priority,
            description: proj.description,
            members: proj.members.length, // Convert to number for ProjectCard
            dueDate: formatDate(proj.dueDate),
            progress: proj.progress,
            status: proj.status,
            teamLead: {
              id: proj.teamLead._id,
              username: proj.teamLead.username,
              email: proj.teamLead.email
            },
            createdAt: formatDate(proj.createdAt),
            updatedAt: formatDate(proj.updatedAt)
          }));

          //console.log('Formatted Projects:', formatted); // Debug log
          setProjects(formatted);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        console.error('Failed to load projects', err);
        setError('Could not load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid date';
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-50 p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <AlertCircle className="w-12 h-12 text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="px-6 py-3"
          >
            Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">My Projects</h1>
            <p className="text-gray-600">
              {projects.length ? (
                <>
                  Showing <span className="font-medium text-indigo-600">{filteredProjects.length}</span> of{' '}
                  <span className="font-medium text-gray-800">{projects.length}</span> projects
                </>
              ) : (
                'Track and manage your projects'
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Link to="/createProject" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
                <Plus size={18} className="mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </motion.header>

        <AnimatePresence>
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <EmptyState
                icon={<Frown className="w-12 h-12 text-gray-400" />}
                title={searchTerm ? "No projects found" : "No projects yet"}
                description={
                  searchTerm
                    ? "Try adjusting your search or create a new project"
                    : "Get started by creating your first project"
                }
                action={
                  <Link to="/createProject">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Button>
                  </Link>
                }
              />
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};