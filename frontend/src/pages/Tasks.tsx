import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= TYPES ================= */

type TaskStatus = "In Progress" | "In Review" | "Completed"

interface User {
  _id: string
  username: string
}

interface Project {
  _id: string
  name: string
}

interface Task {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  project: Project
  assignedTo: User
}

/* ================= COMPONENT ================= */

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------- Fetch Tasks ---------- */

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/myTask`, {
          credentials: "include",
        })

        const json = await res.json()
        setTasks(json.data || [])
      } catch {
        toast.error("Failed to load tasks")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  /* ---------- Update Status (In Progress → In Review) ---------- */

  const markForReview = async (taskId: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "In Review" }),
      })

      setTasks(prev =>
        prev.map(task =>
          task._id === taskId
            ? { ...task, status: "In Review" }
            : task
        )
      )

      toast.success("Task marked for review")
    } catch {
      toast.error("Failed to update task")
    }
  }

  /* ---------- Status Badge Style ---------- */

  const statusVariant = (status: TaskStatus) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Review":
        return "secondary"
      default:
        return "outline"
    }
  }

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">
            Tasks assigned to you
          </p>
        </div>

        <Button onClick={() => navigate("/tasks/new")}>
          Create New Task
        </Button>
      </div>

      {!loading && tasks.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          No tasks assigned
        </div>
      )}

      <div className="grid gap-4">
        {tasks.map(task => (
          <Card key={task._id}>
            <CardContent className="p-5 space-y-3">
              {/* Title */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">
                  {task.title}
                </h3>

                <Badge variant={statusVariant(task.status)}>
                  {task.status}
                </Badge>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}

              {/* Project */}
              <p className="text-sm">
                <span className="text-muted-foreground">
                  Project:
                </span>{" "}
                <span className="font-medium">
                  {task.project.name}
                </span>
              </p>

              {/* Action */}
              {task.status === "In Progress" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => markForReview(task._id)}
                >
                  Mark for Review
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
