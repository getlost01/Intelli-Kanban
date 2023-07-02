import React, { useState } from 'react';
import { Container, Link, Chip, Card, TextField, Button, Grid } from '@mui/material';
// utils
import axios from '../src/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
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

  const handleLoginSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post('/api/user/login', loginForm);
    if(response.data.error){
      toast.error(response.data.message);
    }else{
      toast.success(response.data.message);
      localStorage.setItem('userId', response.data.user.id);
      router.push("/kanban");
    }
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
    <Grid display={"flex"} alignItems={"center"} mb={4} justifyContent={"center"}>
            <Link href="/signup">
              <Chip label="Signup" sx={{ mx: 1, fontSize: "1rem", cursor: "pointer"}} />
            </Link>
            or
            <Link href="/login" >
              <Chip label="Login" sx={{ mx: 1, fontSize: "1rem", cursor: "pointer"}} />
            </Link>
        </Grid>

        <ToastContainer />

      <form onSubmit={handleLoginSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required = {true}
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
            required = {true}
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
