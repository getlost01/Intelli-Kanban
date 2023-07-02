import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';


const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if(!localStorage.getItem('userId'))
      router.push("/login");
    else
      router.push("/kanban");
  }, []);

  return (
    <Grid sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      }}>
        <CircularProgress color='success'/>
    </Grid>
  )
}

export default Home
