// src/pages/TaskDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Box
} from "@mui/material";
import { useTasks } from "../contexts/TaskContext";
import { useTeam } from "../contexts/TeamContext";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { tasks, addComment, updateTask } = useTasks();
  const { team } = useTeam();

  const [task, setTask] = useState(null);
  const [comment, setComment] = useState("");

  // 🔥 Recalculate the task every time tasks or id changes
  useEffect(() => {
    const found = tasks.find(
      (t) => String(t.id).trim() === String(id).trim()
    );
    setTask(found || null);
  }, [tasks, id]);

  if (!task)
    return (
      <Container>
        <Typography>Task not found</Typography>
      </Container>
    );

  const assignedName =
    team.find((m) => m.id === task.assignedTo)?.name || "Unassigned";

  return (
    <Container>
      <Button onClick={() => navigate(-1)} sx={{ mb: 1 }}>
        Back
      </Button>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h5">{task.title}</Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {task.description}
        </Typography>
        <Typography variant="caption">
          Priority: {task.priority} • Status: {task.status} • Assigned:{" "}
          {assignedName} • Due:{" "}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "—"}
        </Typography>

        {/* Activity Log */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Activity</Typography>
          {task.activityLog?.map((a, idx) => (
            <div key={idx}>
              <small>
                {new Date(a.timestamp).toLocaleString()} — {a.action}
              </small>
            </div>
          ))}
        </Box>

        {/* Comments */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Comments</Typography>
          {task.comments?.map((c, i) => (
            <div key={i}>
              <small>
                {new Date(c.timestamp).toLocaleString()} — {c.text}
              </small>
            </div>
          ))}

          <TextField
            fullWidth
            multiline
            minRows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 1 }}
          />

          <Button
            sx={{ mt: 1 }}
            variant="contained"
            onClick={() => {
              if (!comment.trim()) return;
              addComment(task.id, comment.trim());
              setComment("");
            }}
          >
            Add Comment
          </Button>
        </Box>

        {/* Status Buttons */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Change status</Typography>

          <Button onClick={() => updateTask(task.id, { status: "Pending" })}>
            Pending
          </Button>

          <Button
            onClick={() => updateTask(task.id, { status: "In-Progress" })}
            sx={{ mx: 1 }}
          >
            In-Progress
          </Button>

          <Button
            onClick={() => updateTask(task.id, { status: "Completed" })}
            variant="contained"
            color="success"
          >
            Mark Completed
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
