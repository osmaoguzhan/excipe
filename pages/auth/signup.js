import {
  Link,
  Grid,
  Box,
  Typography,
  Button,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import FormInput from "../../components/inputs/formInput";
import Validator from "../../utils/validator";
import Swal from "sweetalert2";
import Messages from "../../utils/messages";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { getSession } from "next-auth/react";
const theme = createTheme();

const urls = [
  "https://media.giphy.com/media/SZQBPO4NqHkh6wmdXk/giphy.gif",
  "https://media.giphy.com/media/10ADU4ag31l63C/giphy.gif",
  "https://media.giphy.com/media/5XLPWTWfj7h6M/giphy.gif",
  "https://media.giphy.com/media/xtgZt3jZelFqU/giphy.gif",
  "https://media.giphy.com/media/7fwBcr9lB0Fos/giphy.gif",
  "https://media.giphy.com/media/lGbz7CsaCj4Tm/giphy.gif",
  "https://media.giphy.com/media/3o7P4F86TAI9Kz7XYk/giphy.gif",
];

const SignUp = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();
  const rules = Validator();
  const router = useRouter();

  const onSubmit = async (formData) => {
    formData.password = await bcrypt.hash(formData.password, 10);
    fetch("/api/signup", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((res) => {
        Swal.fire({
          title: "Success!",
          text: Messages.success.accountCreated,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => router.replace("/auth/signin"));
      })
      .catch((err) => {
        reset(
          {},
          {
            keepValues: false,
          }
        );
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component='main' sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
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
                name={"name"}
                label={"Name"}
                control={control}
                errors={errors}
                validation={rules.firstName}
              />
              <FormInput
                name={"surname"}
                label={"Surname"}
                control={control}
                errors={errors}
                validation={rules.lastName}
              />
              <FormInput
                name={"email"}
                label={"Email"}
                control={control}
                errors={errors}
                validation={rules.email}
              />
              <FormInput
                name={"password"}
                label={"Password"}
                type={"password"}
                control={control}
                errors={errors}
                validation={rules.password}
              />
              <Button
                type={"submit"}
                fullWidth
                style={{ backgroundColor: "#8b9787" }}
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit((d) => onSubmit(d))}>
                Sign Up
              </Button>
              <Grid container display={"flex"} justifyContent={"flex-end"}>
                <Grid item>
                  <Link href='/auth/signin'>Already have an account?</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (session)
    return {
      redirect: {
        destination: "/fridge",
        permanent: false,
      },
    };
  return {
    props: {
      data: null,
    },
  };
};

export default SignUp;
