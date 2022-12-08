import Swal from "sweetalert2";
import Messages from "@/utils/messages";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import SignupForm from "@/components/forms/signupForm";
import { absoluteUrl } from "@/utils/helpers";

const SignUp = () => {
  const router = useRouter();
  const onSubmit = async (formData) => {
    formData.password = await bcrypt.hash(formData.password, 10);
    fetch(absoluteUrl("/api/signup"), {
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
      .catch((err) => {});
  };
  return <SignupForm onSubmit={onSubmit} />;
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
