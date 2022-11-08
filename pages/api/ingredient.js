import prisma from "@/lib/prisma";
import { exclude } from "@/utils/helpers";
import moment from "moment";
exclude;

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      try {
        const { name, expiryDate, id } = req.body;
        const addedIngredient = await prisma.ingredient.create({
          data: {
            name,
            expiryDate,
            userId: id,
          },
        });
        res.status(200).send({
          success: true,
          message: "Successfully added.",
          data: addedIngredient,
        });
      } catch (err) {
        throw new Error("Error while adding the ingredient.");
      }
      break;
    case "GET":
      try {
        const { userid } = req.headers;
        let ingredients = await prisma.ingredient.findMany({
          where: {
            userId: userid,
          },
        });
        if (ingredients) {
          let today = new Date();
          ingredients.forEach((ingredient) => {
            let diff = moment(ingredient.expiryDate).diff(today, "days");
            ingredient.status =
              diff > 3 ? "Fresh" : diff > 0 ? "Stale" : "Expired";
          });
        }
        ingredients = exclude(ingredients, ["userId"]);
        res.status(200).json({ success: true, data: ingredients });
      } catch (err) {
        res.status(400).json({
          success: false,
          message: "Error while fething the ingredient.",
        });
      }
      break;
    case "DELETE":
      try {
        const ids = req.body;
        await prisma.ingredient.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        });
        res.statusCode = 200;
        res
          .status(200)
          .json({ success: true, message: "Successfully deleted" });
      } catch (err) {
        res.status(400).json({
          success: false,
          message: "Error while adding the ingredient.",
        });
      }
      break;
  }
}
