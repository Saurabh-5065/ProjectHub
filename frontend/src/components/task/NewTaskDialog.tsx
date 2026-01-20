import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
const API_BASE_URL = import.meta.env.VITE_API_URL;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* -------------------- TYPES -------------------- */

type Priority = "Low" | "Medium" | "High";

interface User {
  _id: string;
  username: string;
}

interface Project {
  _id: string;
  name: string;
  teamLead: User;
  members: User[];
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  status: "In Progress" | "In Review" | "Completed";
  project: { _id: string; name: string };
  assignedTo: User;
}


// interface NewTaskDialogProps {
//   onCreate: (task: Task) => void;
// }

/* -------------------- COMPONENT -------------------- */
export default function NewTaskDialog({ onCreate }: { onCreate: (task: Task) => void }) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    const res = await fetch(`${API_BASE_URL}/api/projectforTask`, {
      credentials: "include",
    });
    const json = await res.json();
    setProjects(json.data);
  };

  const selectedProject = projects.find(p => p._id === projectId);

  const assignees = selectedProject
    ? [selectedProject.teamLead, ...selectedProject.members]
    : [];

  const handleSubmit = async () => {
    if (!title || !projectId || !assigneeId) {
      setError("All required fields must be filled");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/createTask`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate,
        projectId,
        assignedTo: assigneeId,
      }),
    });

    const json = await res.json();
    onCreate(json.data);

    setOpen(false);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setProjectId("");
    setAssigneeId("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) fetchProjects(); }}>
      <DialogTrigger asChild>
        <Button>+ New Task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

          <Select value={projectId} onValueChange={(v) => { setProjectId(v); setAssigneeId(""); }}>
            <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
            <SelectContent>
              {projects.map(p => (
                <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedProject && (
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger><SelectValue placeholder="Assign to" /></SelectTrigger>
              <SelectContent>
                {assignees.map(u => (
                  <SelectItem key={u._id} value={u._id}>{u.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />

          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleSubmit}>Create Task</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
