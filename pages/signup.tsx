import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  Grid,
  Chip,
  Avatar,
} from '@mui/material';

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
}

const SignUpPage = () => {
  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatar: '',
  });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup Form:', signupForm);
    // Perform signup logic here
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
            <Chip label="Signup to Intelli-Kanban" sx={{mb: 4, fontSize: "1rem"}} />
        </Grid>
        <form onSubmit={handleSignupSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                type="text"
                name="firstName"
                label="First Name"
                fullWidth
                value={signupForm.firstName}
                onChange={handleSignupChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                type="text"
                name="lastName"
                label="Last Name"
                fullWidth
                value={signupForm.lastName}
                onChange={handleSignupChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                type="email"
                name="email"
                label="Email"
                fullWidth
                value={signupForm.email}
                onChange={handleSignupChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                type="password"
                name="password"
                label="Password"
                fullWidth
                value={signupForm.password}
                onChange={handleSignupChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                type="text"
                name="avatar"
                label="Avatar"
                fullWidth
                value={signupForm.avatar}
                onChange={handleSignupChange}
                />
            </Grid>
            <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign Up
                </Button>
            </Grid>
            </Grid>
        </form>
      </Card>
    </Grid>
  );
};

export default SignUpPage;
