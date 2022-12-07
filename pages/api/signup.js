import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, surname, nickname, password } = req.body;
    try {
      await prisma.user.create({
        data: {
          name,
          surname,
          nickname,
          password,
        },
      });
      res.status(200).json({
        success: true,
        message: "Successfully created the user.",
      });
    } catch (err) {
      throw new Error("Error while creating the user.");
    }
  }
}
