import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ================= TYPES ================= */

type TaskStatus = "In Progress" | "In Review" | "Completed"

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
}

/* ================= COMPONENT ================= */

export default function ReviewTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------- Fetch Tasks In Review ---------- */

  useEffect(() => {
    const fetchReviewTasks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/taskInReview`, {
          credentials: "include",
        })

        const json = await res.json()

        // Show only tasks that are actually in review
        const inReviewTasks = (json.data || []).filter(
          (task: Task) => task.status === "In Review"
        )

        setTasks(inReviewTasks)
      } catch {
        toast.error("Failed to load review tasks")
      } finally {
        setLoading(false)
      }
    }

    fetchReviewTasks()
  }, [])

  /* ---------- Update Task Status ---------- */

  const updateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      })

      setTasks(prev =>
        status === "Completed"
          ? prev.filter(t => t._id !== taskId) // remove completed from review list
          : prev.map(t =>
              t._id === taskId ? { ...t, status } : t
            )
      )

      toast.success(
        status === "Completed"
          ? "Task marked as completed"
          : "Task sent back to In Progress"
      )
    } catch {
      toast.error("Failed to update task")
    }
  }

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tasks In Review</h1>
        <p className="text-muted-foreground">
          Review tasks submitted by team members
        </p>
      </div>

      {!loading && tasks.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          No tasks pending review 🎉
        </div>
      )}

      <div className="grid gap-4">
        {tasks.map(task => (
          <Card key={task._id}>
            <CardContent className="p-5 space-y-3">
              {/* Title & Status */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">
                  {task.title}
                </h3>
                <Badge variant="secondary">In Review</Badge>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}

              {/* Project */}
              <p className="text-sm">
                <span className="text-muted-foreground">Project:</span>{" "}
                <span className="font-medium">
                  {task.project.name}
                </span>
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  size="sm"
                  onClick={() =>
                    updateStatus(task._id, "Completed")
                  }
                >
                  Mark Completed
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateStatus(task._id, "In Progress")
                  }
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
