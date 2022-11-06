import { getSession } from "next-auth/react";

export const requireAuth = async (ctx, cb) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        parmanent: false,
      },
    };
  }
  return cb(session);
};
