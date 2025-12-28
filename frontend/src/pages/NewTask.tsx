import { useNavigate } from "react-router-dom"
import NewTaskDialog from "@/components/task/NewTaskDialog"

export default function NewTask() {
  const navigate = useNavigate()

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Task</h1>
        <p className="text-muted-foreground">
          Assign task to a project member
        </p>
      </div>

      <NewTaskDialog
        onCreate={() => {
          navigate("/tasks")   //backend is source of truth
        }}
      />
    </div>
  )
}
