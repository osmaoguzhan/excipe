import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, expiryDate, id } = req.body;
    try {
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
