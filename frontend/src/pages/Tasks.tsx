import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Flag } from "lucide-react"

import NewTaskDialog from "@/components/task/NewTaskDialog"

export default function Tasks() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design user authentication flow",
      project: "E-commerce Platform",
      priority: "High",
      dueDate: "Nov 25, 2024",
      assignee: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5f0?w=32&h=32&fit=crop&crop=face"
      },
      completed: false
    },
    {
      id: 2,
      title: "Implement payment gateway",
      project: "E-commerce Platform",
      priority: "High",
      dueDate: "Nov 28, 2024",
      assignee: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
      },
      completed: false
    },
    {
      id: 3,
      title: "Update mobile responsiveness",
      project: "Mobile App Redesign",
      priority: "Medium",
      dueDate: "Nov 30, 2024",
      assignee: {
        name: "Emily Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
      },
      completed: true
    }
  ])

  // 🧠 Function to toggle task status
  const toggleTaskCompletion = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )

    // 🔁 OPTIONAL: call API here to sync with backend
    // await fetch('/api/update-task', { method: 'POST', body: JSON.stringify({ id, completed: newStatus }) })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600"
      case "Medium": return "text-yellow-600"
      case "Low": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Track and manage your tasks across all projects</p>
        </div>
        <NewTaskDialog onCreate={(task) => setTasks(prev => [task, ...prev])} />
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className={`hover:shadow-md transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{task.project}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback className="text-xs">
                          {task.assignee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
