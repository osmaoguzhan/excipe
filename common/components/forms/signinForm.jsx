import {
  Button,
  CssBaseline,
  Grid,
  Box,
  Typography,
  InputAdornment,
  darken,
} from "@mui/material/";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormInput from "@/components/inputs/formInput";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Constants from "@/utils/constants";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const SigninForm = ({ onSubmit }) => {
  const { handleSubmit, control } = useForm();
  const [showPassword, setShowPassword] = useState(true);
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
            Constants.urls[Math.floor(Math.random() * Constants.urls.length)]
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
              id='nickname'
              label='Nickname'
              name='nickname'
              autoComplete='nickname'
              control={control}
            />
            <FormInput
              required
              name='password'
              label='Password'
              id='password'
              autoComplete='current-password'
              control={control}
              type={showPassword ? "password" : "text"}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position={"end"}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        color: darken("rgb(78,115,223)", 0.4),
                      },
                    }}
                    onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </InputAdornment>
                ),
              }}
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
