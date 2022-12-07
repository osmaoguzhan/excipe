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
        if (!userid) {
          res.status(400).json({
            success: false,
            message: "User id is required.",
          });
        }
        let ingredients = await prisma.ingredient.findMany({
          where: {
            userId: userid,
          },
        });
        if (ingredients) {
          let today = moment();
          ingredients.forEach((ingredient) => {
            let diff = moment(ingredient.expiryDate).diff(today, "days", true);
            ingredient.status =
              diff > 3 ? "Fresh" : diff > 0 ? "Stale" : "Expired";
            ingredient.daysLeft = diff;
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
    case "PUT":
      try {
        let { id, name, expiryDate } = req.body;
        console.log(id, name, expiryDate, "id, name, expiryDate");
        let ingredient = await prisma.ingredient.update({
          where: { id },
          data: {
            name,
            expiryDate,
          },
        });
        res.status(200).json({
          success: true,
          data: ingredient,
          message: "Successfully updated.",
        });
      } catch (err) {
        res.status(400).json({
          success: false,
          message: "Error while updating the ingredient.",
        });
      }
      break;
  }
}
