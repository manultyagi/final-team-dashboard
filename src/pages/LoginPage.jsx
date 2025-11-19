// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const res = login(username.trim(), password);
    if (res.success) navigate("/dashboard");
    else alert(res.message || "Login failed");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
        <form onSubmit={submit}>
          <TextField label="Username" fullWidth sx={{ mb: 2 }} value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button variant="contained" type="submit">Login</Button>
        </form>
        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          (Any username; password must be 4+ characters)
        </Typography>
      </Box>
    </Container>
  );
}
