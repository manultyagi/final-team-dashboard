// src/pages/DashboardPage.jsx
import React from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { useTasks } from "../contexts/TaskContext";

export default function DashboardPage() {
  const { tasks } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status !== "Completed").length;
  const overdue = tasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    // compare date-only ignoring time
    const now = new Date();
    due.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return due < now && t.status !== "Completed";
  }).length;

  const stats = [
    { title: "Total tasks", value: total },
    { title: "Completed tasks", value: completed },
    { title: "Pending tasks", value: pending },
    { title: "Overdue tasks", value: overdue }
  ];

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>Dashboard</Typography>
      <Grid container spacing={2}>
        {stats.map(s => (
          <Grid item xs={12} sm={6} md={3} key={s.title}>
            <Paper sx={{ p:2 }}>
              <Typography variant="subtitle2">{s.title}</Typography>
              <Typography variant="h5">{s.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
