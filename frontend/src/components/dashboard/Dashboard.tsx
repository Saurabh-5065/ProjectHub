import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

/* ================= COMPONENT ================= */

// type TaskStatus = "In Progress" | "In Review" | "Completed"

// interface Task {
//   _id: string
//   status: TaskStatus
// }


export default function Dashboard() {
  const navigate = useNavigate()

  const [pendingInvites, setPendingInvites] = useState(0)
  const [inReviewTasks, setInReviewTasks] = useState(0)
  const [inProgressTasks, setInProgressTasks] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [loading, setLoading] = useState(true)

  /* ---------- Fetch Dashboard Data ---------- */

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        /* Pending Invitations */
        const inviteRes = await fetch(
          "http://localhost:8000/api/requests",
          { credentials: "include" }
        )
        const inviteJson = await inviteRes.json()
        setPendingInvites(inviteJson.data?.length || 0)

        /* My Tasks */
        const taskRes = await fetch(
          "http://localhost:8000/api/myTask",
          { credentials: "include" }
        )
        const taskJson = await taskRes.json()

        const tasks = taskJson.data || []

        const rtaskRes = await fetch(
          "http://localhost:8000/api/taskInReview",
          { credentials: "include" }
        )
        const rtaskJson = await rtaskRes.json()

        const rtasks = rtaskJson.data || []

        setInReviewTasks(
          rtasks.filter((t: any) => t.status === "In Review").length
        )

        setInProgressTasks(
          tasks.filter((t: any) => t.status === "In Progress").length
        )

        setCompletedTasks(
          tasks.filter((t: any) => t.status === "Completed").length
        )
      } catch {
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  /* ---------- Card Component ---------- */

  const StatCard = ({
    title,
    count,
    description,
    route,
  }: {
    title: string
    count: number
    description: string
    route: string
  }) => (
    <Card>
      <CardContent className="p-6 space-y-3">
        <h3 className="text-sm text-muted-foreground">
          {title}
        </h3>

        <p className="text-4xl font-bold">
          {loading ? "—" : count}
        </p>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(route)}
        >
          View
        </Button>
      </CardContent>
    </Card>
  )

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your work
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Invitations"
          count={pendingInvites}
          description="Invitations waiting for your response"
          route="/invitations"
        />

        <StatCard
          title="Pending Reviews"
          count={inReviewTasks}
          description="Tasks awaiting your review"
          route="/inReview"
        />

        <StatCard
          title="Pending Tasks"
          count={inProgressTasks}
          description="Tasks currently in progress"
          route="/tasks"
        />

        <StatCard
          title="Completed Tasks"
          count={completedTasks}
          description="Tasks you have completed"
          route="/tasks"
        />
      </div>
    </div>
  )
}
