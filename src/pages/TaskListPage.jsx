// src/pages/TaskListPage.jsx
import React, { useMemo, useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Grid,
  Paper
} from "@mui/material";
import { useTasks } from "../contexts/TaskContext";
import { useTeam } from "../contexts/TeamContext";
import TaskForm from "../components/TaskForm";
import { useNavigate } from "react-router-dom";

export default function TaskListPage() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { team } = useTeam();
  const navigate = useNavigate();

  // UI State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  // Dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  // Derived list with filtering + searching
  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (statusFilter && t.status !== statusFilter) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (assignedFilter && String(t.assignedTo) !== String(assignedFilter))
        return false;
      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter, assignedFilter]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Handlers
  const handleAddSave = payload => {
    addTask(payload);
    setOpenAdd(false);
    setPage(1);
  };

  const handleEditSave = payload => {
    updateTask(editing.id, payload);
    setEditing(null);
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          mb: 2
        }}
      >
        <h2>Tasks</h2>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Add Task
        </Button>
      </Box>

      {/* Filters Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search title"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In-Progress">In-Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Priority"
            value={priorityFilter}
            onChange={e => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Assigned"
            value={assignedFilter}
            onChange={e => {
              setAssignedFilter(e.target.value);
              setPage(1);
            }}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {team.map(m => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Task List */}
      {pageItems.map(t => (
        <Paper
          key={t.id}
          sx={{ p: 2, mb: 2, border: "1px solid #ddd" }}
          elevation={1}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/tasks/${t.id}`)}
            >
              <strong>{t.title}</strong>
            </Box>

            <Box>
              <Button onClick={() => setEditing(t)}>Edit</Button>
              <Button
                color="error"
                onClick={() => {
                  if (window.confirm("Delete task?")) deleteTask(t.id);
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>

          <Box sx={{ fontSize: 13, color: "#555", mt: 1 }}>
            {t.priority} • {t.status} •{" "}
            {t.dueDate
              ? new Date(t.dueDate).toLocaleDateString()
              : "No due date"}
          </Box>
        </Paper>
      ))}

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 3,
          gap: 2,
          alignItems: "center"
        }}
      >
        <Button
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Prev
        </Button>

        <span>
          Page <strong>{page}</strong> of <strong>{pageCount}</strong>
        </span>

        <Button
          disabled={page >= pageCount}
          onClick={() => setPage(p => Math.min(pageCount, p + 1))}
        >
          Next
        </Button>
      </Box>

      {/* Add Task dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TaskForm
            onCancel={() => setOpenAdd(false)}
            onSave={handleAddSave}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Task dialog */}
      <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {editing && (
            <TaskForm
              initial={editing}
              onCancel={() => setEditing(null)}
              onSave={handleEditSave}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
