import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  TextField,
  Button,
  Card,
  Grid,
  Link,
  CircularProgress,
  Chip,
  Avatar,
} from '@mui/material';

import axios from "../src/utils/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { set } from 'date-fns';
interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SignUpPage = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const response = await axios.post('/api/user/signup', signupForm);
    if(response.data.error){
      toast.error(response.data.message);
      setIsLoading(false);
    }else{
      setTimeout(() => {
      toast.success(response.data.message);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('kanbanId', response.data.user.recentBoard);
      router.push("/kanban/welcome");
      setIsLoading(false);
      }, 2000);
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

        <form onSubmit={handleSignupSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                required = {true}
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
                required = {true}
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
                required = {true}
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
                required = {true}
                type="password"
                name="password"
                label="Password"
                fullWidth
                value={signupForm.password}
                onChange={handleSignupChange}
                />
            </Grid>
            <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth
                  disabled={isLoading}
                  startIcon={isLoading && <CircularProgress size={20} color='inherit' />}
                  >
                    {isLoading ? 'Loading...' :  'SignUp' }
                </Button>
            </Grid>
            </Grid>
        </form>
      </Card>
    </Grid>
  );
};

export default SignUpPage;
