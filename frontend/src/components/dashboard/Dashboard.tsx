import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();

  const [pendingInvites, setPendingInvites] = useState(0);
  const [inReviewTasks, setInReviewTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const requests = [
          fetch(`${API_BASE_URL}/api/requests`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${API_BASE_URL}/api/myTask`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${API_BASE_URL}/api/taskInReview`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
        ];

        const [inviteRes, taskRes, reviewRes] = await Promise.all(requests);

        // 🔐 AUTH CHECK
        if (
          inviteRes.status === 401 ||
          taskRes.status === 401 ||
          reviewRes.status === 401
        ) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }

        if (!inviteRes.ok || !taskRes.ok || !reviewRes.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const inviteJson = await inviteRes.json();
        const taskJson = await taskRes.json();
        const reviewJson = await reviewRes.json();

        const tasks = taskJson.data || [];
        const reviewTasks = reviewJson.data || [];

        setPendingInvites(inviteJson.data?.length ?? 0);

        setInReviewTasks(
          reviewTasks.filter((t: any) => t.status === "In Review").length
        );

        setInProgressTasks(
          tasks.filter((t: any) => t.status === "In Progress").length
        );

        setCompletedTasks(
          tasks.filter((t: any) => t.status === "Completed").length
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const StatCard = ({
    title,
    count,
    description,
    route,
  }: {
    title: string;
    count: number;
    description: string;
    route: string;
  }) => (
    <Card>
      <CardContent className="p-6 space-y-3">
        <h3 className="text-sm text-muted-foreground">{title}</h3>

        <p className="text-4xl font-bold">
          {loading ? "—" : count}
        </p>

        <p className="text-sm text-muted-foreground">{description}</p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(route)}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your work</p>
      </div>

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
  );
}
