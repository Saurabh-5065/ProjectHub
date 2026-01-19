import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  ArrowLeft, Edit, Save, Trash2, X, Calendar, Users, 
  AlertCircle, Flag, FileText, User, Lock, Search, Plus, Minus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import type { ProjectPriority } from '../types';
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface TeamMember {
  _id: string;
  username: string;
  email: string;
}

interface ProjectDetailData {
  _id: string;
  name: string;
  priority: ProjectPriority;
  description: string;
  members: TeamMember[];
  dueDate: string;
  progress: number;
  status: string;
  teamLead: TeamMember;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFormData {
  name?: string;
  priority?: ProjectPriority;
  description?: string;
  status?: string;
  progress?: number;
  dueDate?: string;
  members: string[]; // Explicitly define as string array
}

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<ProjectFormData>({
  members: [] // Initialize with empty array
});
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [allUsers, setAllUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  //const [formData, setFormData] = useState<Partial<ProjectDetailData>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user and all users
        const [meRes, usersRes, projectRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/auth/me`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/auth/users`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/projects/${id}`, { withCredentials: true })
        ]);

        setCurrentUser(meRes.data?.data);
        setAllUsers(usersRes.data?.data || []);

        if (projectRes.data?.success) {
                const projectData = projectRes.data.data;
                setProject(projectData);
                setFormData({
                name: projectData.name,
                priority: projectData.priority,
                description: projectData.description,
                status: projectData.status,
                progress: projectData.progress,
                dueDate: projectData.dueDate.split('T')[0],
                members: projectData.members.map((m: TeamMember) => m._id) // Ensure we only store IDs
                });
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Failed to load data', err);
        setError('Could not load project. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (allUsers.length > 0 && formData.members) {
      const available = allUsers.filter(
        user => !formData.members?.includes(user._id) && 
               user._id !== project?.teamLead._id
      );
      setAvailableUsers(available);
    }
  }, [allUsers, formData.members, project?.teamLead._id]);

  const isTeamLead = currentUser?._id === project?.teamLead._id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = (userId: string) => {
  setFormData(prev => ({
    ...prev,
    members: [...(prev.members || []), userId]
  }));
  setSearchTerm('');
};

  const handleRemoveMember = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members?.filter(id => id !== userId) || []
    }));
  };

  const handleSave = async () => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/api/projects/${id}`,
      {
        ...formData,
        dueDate: new Date(formData.dueDate || '').toISOString()
      },
      { withCredentials: true }
    );

    if (res.data?.success) {
      toast.success('Project updated successfully');
      setIsEditing(false);
      
      // Convert member IDs back to full member objects for the project state
      const updatedMembers = allUsers.filter(user => 
        formData.members?.includes(user._id)
      );

      // Refresh project data with proper types
      const updatedProject = { 
        ...project!, 
        ...formData,
        members: updatedMembers,
        dueDate: new Date(formData.dueDate || '').toISOString()
      };
      
      setProject(updatedProject);
    } else {
      toast.error('Failed to update project');
    }
  } catch (err) {
    console.error('Error updating project', err);
    toast.error('Could not update project. Please try again.');
  }
};

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await axios.delete(
          `${API_BASE_URL}/api/projects/${id}`,
          { withCredentials: true }
        );

        if (res.data?.success) {
          toast.success('Project deleted successfully');
          navigate('/projects');
        } else {
          toast.error('Failed to delete project');
        }
      } catch (err) {
        console.error('Error deleting project', err);
        toast.error('Could not delete project. Please try again.');
      }
    }
  };

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

  const getPriorityVariant = (priority: ProjectPriority) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Critical': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'Near Completion': return 'outline';
      case 'On Hold': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error Loading Project</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-6">
        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Project Not Found</h2>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/projects')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            {isEditing ? (
              <Input
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="text-2xl font-bold w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            )}
            <div className="flex items-center gap-2 mt-2">
              {isEditing ? (
                <Select
                  value={formData.priority || ''}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={getPriorityVariant(project.priority)}>
                  {project.priority} Priority
                </Badge>
              )}
              {isEditing ? (
                <Select
                  value={formData.status || ''}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Near Completion">Near Completion</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              )}
              {!isTeamLead && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Lock size={14} />
                  View Only
                </Badge>
              )}
            </div>
          </div>
          
          {isAuthenticated && isTeamLead ? (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save size={16} className="mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock size={16} />
              <span>Only team lead can edit</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FileText size={18} />
                Description
              </h2>
              {isEditing ? (
                <Textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="min-h-[120px]"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">
                  {project.description || 'No description provided'}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Flag size={18} />
                Progress
              </h2>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      value={formData.progress || 0}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700 w-12 text-center">
                      {formData.progress}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-sm text-gray-600">{project.progress}% complete</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Calendar size={18} />
                Due Date
              </h2>
              {isEditing ? (
                <Input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="text-gray-700">
                  {formatDate(project.dueDate)}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <User size={18} />
                Team Lead
              </h2>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">{project.teamLead.username}</p>
                  <p className="text-xs text-gray-500">Team Lead</p>
                  {currentUser?._id === project.teamLead._id && (
                    <Badge variant="outline" className="text-xs mt-1">
                      You
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users size={18} />
            Team Members ({isEditing ? formData.members?.length || 0 : project.members.length})
          </h2>
          
          {isEditing ? (
            <div className="space-y-4">
              {/* Selected Members */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-700">Current Team</h3>
                </div>
                <div className="p-4">
                  {formData.members?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.members.map(memberId => {
                        const member = allUsers.find(u => u._id === memberId);
                        if (!member) return null;
                        return (
                          <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                {member.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{member.username}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Minus size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No team members selected</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Members */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-medium text-gray-700">Add Team Members</h3>
                </div>
                <div className="p-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="text-gray-400" size={16} />
                    </div>
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="mt-4 max-h-60 overflow-y-auto">
                    {availableUsers.filter(user => 
                      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No users found</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {availableUsers
                          .filter(user => 
                            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(user => (
                            <li key={user._id} className="py-3">
                              <button
                                type="button"
                                onClick={() => handleAddMember(user._id)}
                                className="w-full flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    {user.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="text-left">
                                    <p className="text-sm font-medium text-gray-800">{user.username}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                                <div className="text-indigo-600">
                                  <Plus size={18} />
                                </div>
                              </button>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {project.members.map((member) => (
                <div key={member._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p className="text-xs text-gray-500">Member</p>
                    {currentUser?._id === member._id && (
                      <Badge variant="outline" className="text-xs mt-1">
                        You
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};