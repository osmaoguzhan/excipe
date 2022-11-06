import * as React from "react";
import { Button, CssBaseline, Grid, Box, Typography } from "@mui/material/";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormInput from "../inputs/formInput";
import { useForm } from "react-hook-form";
import Link from "next/link";

const urls = [
  "https://media.giphy.com/media/SZQBPO4NqHkh6wmdXk/giphy.gif",
  "https://media.giphy.com/media/10ADU4ag31l63C/giphy.gif",
  "https://media.giphy.com/media/5XLPWTWfj7h6M/giphy.gif",
  "https://media.giphy.com/media/xtgZt3jZelFqU/giphy.gif",
  "https://media.giphy.com/media/7fwBcr9lB0Fos/giphy.gif",
  "https://media.giphy.com/media/lGbz7CsaCj4Tm/giphy.gif",
  "https://media.giphy.com/media/3o7P4F86TAI9Kz7XYk/giphy.gif",
];

const SigninForm = ({ onSubmit }) => {
  const { handleSubmit, control } = useForm();
  return (
    <Grid container component='main' sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        borderRadius={"3px"}
        sx={{
          backgroundImage: `url(${
            urls[Math.floor(Math.random() * urls.length)]
          })`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}>
            <FormInput
              required
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              control={control}
            />
            <FormInput
              required
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              control={control}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: "#8b9787" }}
              onClick={handleSubmit((d) => onSubmit(d))}>
              Sign In
            </Button>
            <Grid container display={"flex"} justifyContent={"flex-end"}>
              <Grid item>
                <Link href='/auth/signup'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SigninForm;
