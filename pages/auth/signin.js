import * as React from "react";
import {
  Button,
  CssBaseline,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material/";
import FormInput from "../../components/inputs/formInput";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as _ from "lodash";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "../../components/loading";
import { useLoading } from "../../contexts/loadingContext";
import Link from "next/link";

const SignIn = () => {
  const { handleSubmit, control, reset } = useForm();
  const { loading, setLoading } = useLoading();
  const { status } = useSession();
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: err.error,
          icon: "error",
          confirmButtonText: "OK",
        });
        reset(
          {},
          {
            keepValues: false,
          }
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/fridge");
    }
  }, [status]);

  return loading ? (
    <Loading />
  ) : (
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
          Sign In
        </Typography>
        <Box component='form' sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormInput name={"email"} label={"Email"} control={control} />
            </Grid>
            <Grid item xs={12}>
              <FormInput
                name={"password"}
                label={"Password"}
                control={control}
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
            {"Sign In"}
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/auth/signup'>{"Don't you have an account?"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
