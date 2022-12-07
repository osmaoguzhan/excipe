import {
  Link,
  Grid,
  Box,
  Typography,
  Button,
  CssBaseline,
  InputAdornment,
  darken,
} from "@mui/material";
import FormInput from "@/components/inputs/formInput";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Constants from "@/utils/constants";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Validator from "@/utils/validator";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SignupForm = ({ onSubmit }) => {
  const rules = Validator();
  const [showPassword, setShowPassword] = useState(true);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  return (
    <Grid container component='main' sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
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
            Sign Up
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit((d) => onSubmit(d))}
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
              name={"nickname"}
              label={"Nickname"}
              control={control}
              errors={errors}
              validation={rules.nickname}
            />
            <FormInput
              name={"password"}
              label={"Password"}
              control={control}
              errors={errors}
              validation={rules.password}
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
  );
};

export default SignupForm;
