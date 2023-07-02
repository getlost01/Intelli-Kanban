import React, { useState } from 'react';
import { Container, Typography, Chip, Card, TextField, Button, Grid } from '@mui/material';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login Form:', loginForm);
    // Perform login logic here
  };

  return (
    <Grid sx={{
        minHeight: "100vh", 
        width: "100%", 
        display: "flex", 
        justifyContent: "center",  
        alignItems: "center",
        background: "linear-gradient(to left, #2a8b8b, #02a16f)"}}
    >
    <Card sx={{ p: 4, my: 3, maxWidth: "40rem", height: "min-content"}}>
        <Grid display={"flex"}  justifyContent={"center"}>
            <Chip label="Login to Intelli-Kanban" sx={{mb: 4, fontSize: "1rem"}} />
        </Grid>

      <form onSubmit={handleLoginSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="email"
              name="email"
              label="Email"
              fullWidth
              value={loginForm.email}
              onChange={handleLoginChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              name="password"
              label="Password"
              fullWidth
              value={loginForm.password}
              onChange={handleLoginChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Card>
    </Grid>
  );
};

export default LoginPage;
