import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, expiryDate, email } = req.body;
    try {
      let { id } = await prisma.user.findFirst({
        where: {
          email: email,
        },
        select: {
          id: true,
        },
      });
      const addedIngredient = await prisma.ingredient.create({
        data: {
          name,
          expiryDate,
          userId: id,
        },
      });
      res.statusCode = 200;
      res.json(addedIngredient);
    } catch (err) {
      throw new Error("Error while adding the ingredient.");
    }
  }
}
