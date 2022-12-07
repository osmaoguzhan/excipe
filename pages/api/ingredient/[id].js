import prisma from "@/lib/prisma";
import { exclude } from "@/utils/helpers";
import moment from "moment";
exclude;

export default async function handler(req, res) {
  const { userid } = req.headers;
  if (!userid) {
    res.status(400).json({
      success: false,
      message: "User id is required.",
    });
  }
  switch (req.method) {
    case "GET":
      try {
        let { id } = req.query;
        let ingredient = await prisma.ingredient.findUnique({ where: { id } });
        res.status(200).json({ success: true, data: ingredient });
      } catch (err) {
        res.status(400).json({
          success: false,
          message: "Error while fething the ingredient.",
        });
      }
      break;
  }
}
