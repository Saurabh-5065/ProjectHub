import { useState, useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface Invitation {
  _id: string;
  sender: { _id: string; name: string; avatar?: string };
  project: { _id: string; name: string; dueDate: string; description?: string };
  createdAt: string;
}

export function InvitationList() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; title: string; message: string; type: "success" | "error" }>
  >([]);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/requests", {
        credentials: "include", // Ensures cookies are sent
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch invitations");
      }

      const data = await res.json();
      setInvitations(data.data);
    } catch (error) {
      addNotification(
        "Error",
        error instanceof Error ? error.message : "Failed to load invitations",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (invitationId: string, action: "accept" | "reject") => {
    try {
      setRespondingId(invitationId);
      const res = await fetch("http://localhost:8000/api/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent
        body: JSON.stringify({
          invitationId,
          response: action === "accept" ? "accepted" : "rejected",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process response");
      }

      const data = await res.json();
      addNotification("Success", data.message, "success");
      setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
    } catch (error) {
      addNotification(
        "Error",
        error instanceof Error ? error.message : "Action failed",
        "error"
      );
    } finally {
      setRespondingId(null);
    }
  };

  const addNotification = (
    title: string,
    message: string,
    type: "success" | "error"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-4 relative">
      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map(({ id, title, message, type }) => (
          <Alert
            key={id}
            variant={type === "error" ? "destructive" : "default"}
          >
            {type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ))}
      </div>

      <h1 className="text-2xl font-bold">Project Invitations</h1>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : invitations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No pending invitations</CardTitle>
          </CardHeader>
        </Card>
      ) : (
        invitations.map((invitation) => (
          <Card key={invitation._id}>
            <CardHeader className="flex flex-row items-center space-x-4">
              <Avatar>
                <AvatarFallback>
                  {invitation.sender.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle>{invitation.project.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Invited by {invitation.sender.name}
                </p>
              </div>
              <Badge variant="outline">
                {new Date(invitation.createdAt).toLocaleDateString()}
              </Badge>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm">
                Due: {new Date(invitation.project.dueDate).toLocaleDateString()}
              </span>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleResponse(invitation._id, "accept")}
                  disabled={respondingId === invitation._id}
                >
                  {respondingId === invitation._id && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponse(invitation._id, "reject")}
                  disabled={respondingId === invitation._id}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}