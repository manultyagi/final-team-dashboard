// src/pages/TeamPage.jsx
import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Grid } from "@mui/material";
import { useTeam } from "../contexts/TeamContext";

export default function TeamPage() {
  const { team, addMember, removeMember } = useTeam();
  const [form, setForm] = useState({ name: "", role: "", email: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("Name and email required");
    addMember(form);
    setForm({ name: "", role: "", email: "" });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>Team</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Role" value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Add Member</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {team.map(m => (
        <Paper key={m.id} sx={{ p: 2, mb: 1 }}>
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <Typography>{m.name} — {m.role} — {m.email}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "right" }}>
              <Button color="error" onClick={() => { if (window.confirm("Remove member?")) removeMember(m.id); }}>Remove</Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Container>
  );
}
