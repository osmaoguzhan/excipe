import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import Swal from "sweetalert2";

export default function RecipeReviewCard({ recipe }) {
  const [mouseAction, setMouseAction] = useState({
    boxShadow: "",
  });

  const {
    ingredients,
    name,
    mainImage,
    nutrientsPerServing,
    totalTime,
    ingredientLines,
    instructions,
  } = recipe;

  const triggerModal = () => {
    let text =
      instructions.length > 0 ? instructions : ingredientLines.join("<br>");
    Swal.fire({
      title: name,
      html: text,
      imageUrl: mainImage,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: name,
      showCancelButton: true,
      confirmButtonText: "Save",
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      }
    });
  };

  const subheader = () => {
    return (
      <>
        <Box>
          <WhatshotIcon
            fontSize='small'
            style={{ marginTop: "4px", marginRight: "3px" }}
          />
          Calories:
          {nutrientsPerServing.calories.length !== 0
            ? nutrientsPerServing.calories
            : "N/A"}
        </Box>
        <Box display={"flex"}>
          <AccessTimeIcon fontSize='small' style={{ marginRight: "3px" }} />
          {totalTime ? totalTime : "N/A"}
        </Box>
      </>
    );
  };

  return (
    <Card
      sx={{ maxWidth: 350 }}
      style={{
        padding: "5px",
        marginTop: "5px",
        backgroundColor: "#e8e7e6",
        cursor: "pointer",
        borderRadius: "5px",
        ...mouseAction,
      }}
      onMouseOver={() =>
        setMouseAction({
          boxShadow: "-1px 10px 29px 0px rgba(0,0,0,0.8)",
        })
      }
      onMouseLeave={() => setMouseAction({ boxShadow: "" })}
      onClick={triggerModal}>
      <CardHeader title={name} subheader={subheader()} />
      <CardMedia component='img' height='200' image={mainImage} alt={name} />
      <CardContent>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}>
          <b>Ingredients:</b>{" "}
          {ingredients.map((ingredient) => ingredient.name).join(", ")}
        </Typography>
      </CardContent>
    </Card>
  );
}
