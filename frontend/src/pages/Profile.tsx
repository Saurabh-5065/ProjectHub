import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, User, Briefcase } from "lucide-react"
import { toast } from "sonner"
const API_BASE_URL = import.meta.env.VITE_API_URL;


/* ================= TYPES ================= */

interface UserProfile {
  _id: string
  name: string
  username: string
  email: string
}

interface Project {
  _id: string
  name: string
  teamLead: string
}

/* ================= COMPONENT ================= */

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------- Fetch Profile ---------- */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/getProfile`, {
          credentials: "include",
        })

        const json = await res.json()
        setUser(json.data.user)
        setProjects(json.data.projects || [])
      } catch {
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <p className="text-muted-foreground">Loading profile...</p>
  }

  if (!user) return null

  /* ---------- Derived Data ---------- */

  const leadingProjects = projects.filter(
    (p) => p.teamLead === user._id
  )

  const enrolledProjects = projects.length

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  /* ================= Render ================= */

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ================= Header ================= */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= Stats ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{enrolledProjects}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              Leading Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {leadingProjects.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================= Projects List ================= */}
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You are not enrolled in any projects
            </p>
          )}

          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <span className="font-medium">{project.name}</span>

              {project.teamLead === user._id && (
                <span className="text-xs rounded-full bg-indigo-100 text-indigo-700 px-2 py-1">
                  Team Lead
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
