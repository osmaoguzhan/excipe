import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, surname, email, password } = req.body;
    try {
      await prisma.user.create({
        data: {
          name,
          surname,
          email,
          password,
        },
      });
      res.statusCode = 200;
      res.json({ name, surname, email });
    } catch (err) {
      throw new Error("Error while creating the user.");
    }
  }
}
