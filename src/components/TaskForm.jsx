// src/components/TaskForm.jsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  FormHelperText
} from "@mui/material";
import { useTeam } from "../contexts/TeamContext";

export default function TaskForm({ initial = null, onCancel, onSave }) {
  const { team } = useTeam();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    assignedTo: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        dueDate: initial.dueDate ? initial.dueDate.split("T")[0] : ""
      });
    }
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title || !form.title.trim()) e.title = "Title is required";
    if (form.dueDate) {
      const selected = new Date(form.dueDate);
      // clear time portion
      selected.setHours(0,0,0,0);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selected < today) e.dueDate = "Due date cannot be in the past";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const change = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    // convert dueDate to ISO or null
    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      assignedTo: form.assignedTo || null
    };
    onSave(payload);
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
            fullWidth
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={(e) => change("description", e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Priority"
            value={form.priority}
            onChange={(e) => change("priority", e.target.value)}
            fullWidth
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => change("status", e.target.value)}
            fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In-Progress">In-Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            type="date"
            label="Due date"
            InputLabelProps={{ shrink: true }}
            value={form.dueDate}
            onChange={(e) => change("dueDate", e.target.value)}
            fullWidth
            error={!!errors.dueDate}
            helperText={errors.dueDate}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            label="Assign to"
            value={form.assignedTo || ""}
            onChange={(e) => change("assignedTo", e.target.value)}
            fullWidth
          >
            <MenuItem value="">Unassigned</MenuItem>
            {team.map(m => (
              <MenuItem key={m.id} value={m.id}>
                {m.name} ({m.role})
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText>Choose team member (optional)</FormHelperText>
        </Grid>

        <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
          <Button type="submit" variant="contained">
            Save
          </Button>
          <Button type="button" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
