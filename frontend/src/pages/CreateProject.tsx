import React, { useEffect, useState } from "react";
import { useForm} from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiSearch, FiX, FiUserPlus, FiChevronDown } from "react-icons/fi";
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface ProjectFormInputs {
  name: string;
  priority: "Low" | "Medium" | "High";
  description: string;
  dueDate: string;
  progress: number;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  teamLead: string;
  members: string[];
}

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormInputs>({
    defaultValues: {
      name: "",
      priority: "Medium",
      description: "",
      dueDate: "",
      progress: 0,
      status: "Not Started",
      teamLead: "",
      members: [],
    },
  });

  const selectedMembers = watch("members");
  const priority = watch("priority");
  const status = watch("status");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, meRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/auth/users`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/auth/me`, { withCredentials: true }),
        ]);

        const fetchedUsers = usersRes.data?.data || [];
        const loggedInUser = meRes.data?.data;

        setAllUsers(fetchedUsers);
        setCurrentUser(loggedInUser);

        if (loggedInUser) {
          setValue("teamLead", loggedInUser._id);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  const onSubmit = async (data: ProjectFormInputs) => {
    try {
      await axios.post(`${API_BASE_URL}/api/createProject`, data, {
        withCredentials: true,
      });
      navigate("/projects");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  const availableMembers = allUsers.filter(
    (u) => u._id !== currentUser?._id && !selectedMembers.includes(u._id)
  );

  const filteredMembers = availableMembers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = (userId: string) => {
    setValue("members", [...selectedMembers, userId]);
    setSearchTerm("");
  };

  const handleRemoveMember = (userId: string) => {
    setValue(
      "members",
      selectedMembers.filter((id) => id !== userId)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "On Hold": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create New Project</h2>
        <p className="text-gray-600 mt-2">Fill in the details to start a new project</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            className="mt-1 bg-white border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            {...register("name", { required: "Project name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            Description
          </Label>
          <Textarea 
            id="description" 
            className="mt-1 bg-white border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 min-h-[120px]" 
            {...register("description")} 
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Priority */}
          <div className="space-y-2 relative">
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Priority
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md border ${getPriorityColor(priority)} border-transparent shadow-sm`}
              >
                <span>{priority}</span>
                <FiChevronDown className={`transition-transform ${isPriorityOpen ? "transform rotate-180" : ""}`} />
              </button>
              {isPriorityOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                  {["High", "Medium", "Low"].map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setValue("priority", option as any);
                        setIsPriorityOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${priority === option ? "bg-indigo-50 text-indigo-700" : ""}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2 relative">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md border ${getStatusColor(status)} border-transparent shadow-sm`}
              >
                <span>{status}</span>
                <FiChevronDown className={`transition-transform ${isStatusOpen ? "transform rotate-180" : ""}`} />
              </button>
              {isStatusOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                  {["Not Started", "In Progress", "Completed", "On Hold"].map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setValue("status", option as any);
                        setIsStatusOpen(false);
                      }}
                      className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${status === option ? "bg-indigo-50 text-indigo-700" : ""}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
              Due Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              className="mt-1 bg-white border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              {...register("dueDate", { required: "Due date is required" })}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Label htmlFor="progress" className="text-sm font-medium text-gray-700">
            Progress (%)
          </Label>
          <div className="flex items-center space-x-4">
            <input
              id="progress"
              type="range"
              min={0}
              max={100}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              {...register("progress", {
                valueAsNumber: true,
                min: { value: 0, message: "Must be at least 0" },
                max: { value: 100, message: "Must be 100 or less" },
              })}
            />
            <span className="text-sm font-medium text-gray-700 w-12 text-center">
              {watch("progress")}%
            </span>
          </div>
          {errors.progress && (
            <p className="text-red-500 text-sm mt-1">{errors.progress.message}</p>
          )}
        </div>

        {/* Team Members Section */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Team Members</Label>
            <p className="text-sm text-gray-500 mt-1">
              Add members to collaborate on this project
            </p>
          </div>

          {/* Selected Members */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-700">Selected Members</h3>
            </div>
            <div className="p-4">
              {selectedMembers.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No members selected yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMembers.map((memberId) => {
                    const member = allUsers.find((u) => u._id === memberId);
                    if (!member) return null;
                    return (
                      <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
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
                          <FiX size={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Member Search */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-medium text-gray-700">Add Members</h3>
            </div>
            <div className="p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              <div className="mt-4 max-h-60 overflow-y-auto">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No members found</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredMembers.map((user) => (
                      <li key={user._id} className="py-3">
                        <button
                          type="button"
                          onClick={() => handleAddMember(user._id)}
                          className="w-full flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-800">{user.username}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-indigo-600">
                            <FiUserPlus size={18} />
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

        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-md transition-all"
          >
            Create Project
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;