import {
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Button,
  CssBaseline,
} from "@mui/material";
import { useForm } from "react-hook-form";
import FormInput from "../../components/formInput";
import Validator from "../../utils/validator";
import Swal from "sweetalert2";
import Messages from "../../utils/messages";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";

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
    await fetch("/api/signup", {
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
    <Container component='main' maxWidth='xs' style={{ marginTop: "10em" }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <Box component='form' sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormInput
                name={"name"}
                label={"Name"}
                control={control}
                errors={errors}
                validation={rules.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                name={"surname"}
                label={"Surname"}
                control={control}
                errors={errors}
                validation={rules.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name={"email"}
                label={"Email"}
                control={control}
                errors={errors}
                validation={rules.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name={"password"}
                label={"Password"}
                control={control}
                errors={errors}
                validation={rules.password}
              />
            </Grid>
          </Grid>
          <Button
            type={"submit"}
            fullWidth
            style={{ backgroundColor: "#8b9787" }}
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit((d) => onSubmit(d))}>
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/auth/signin'>Already have an account?</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
