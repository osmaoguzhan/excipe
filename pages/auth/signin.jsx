import * as React from "react";
import Swal from "sweetalert2";
import * as _ from "lodash";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Loading from "@/components/loading";
import { useLoading } from "@/contexts/loadingContext";
import SigninForm from "@/components/forms/signinForm";

const SignIn = () => {
  const { loading, setLoading } = useLoading();
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    const { ok, error } = await signIn("credentials", {
      nickname: data.nickname,
      password: data.password,
      redirect: false,
    });
    if (ok) {
      setLoading(true);
      router.replace("/fridge");
    }
    if (error) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return loading ? <Loading /> : <SigninForm onSubmit={onSubmit} />;
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

export default SignIn;
