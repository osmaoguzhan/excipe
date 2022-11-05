import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import List from "../components/list";
import RecipeReviewCard from "../components/card";
import Loading from "../components/loading";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import graphqlClient from "../graphql/graphqlClient";
import { RECIPES } from "../graphql/queries";
import useArray from "../hooks/useArray";
import useToggle from "../hooks/useToggle";
import { useLoading } from "../contexts/loadingContext";

const Recipes = () => {
  const { array, push, remove } = useArray([]);
  const [drawerState, toggleDrawer] = useToggle(false);
  const [value, setValue] = useState("");
  const [recipes, setRecipes] = useState([]);
  const { loading, setLoading } = useLoading();

  const handleClick = async (e) => {
    e.preventDefault();
    setValue("");
    if (array.find((x) => value.toLowerCase() === x.toLowerCase())) {
      Swal.fire({
        title: "Error!",
        text: "Ingredient is on the list already.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      push(value);
    }
  };

  const deleteIngredient = async (e, ingredient) => {
    if (array.length === 1) {
      toggleDrawer(false);
      setRecipes([]);
    }
    remove(array.indexOf(ingredient));
  };

  useEffect(() => {
    async function get() {
      setLoading(true);
      if (array.length > 0) {
        const variables = {
          listOfIngredients: array,
        };
        const data = await graphqlClient.request(
          RECIPES,
          JSON.stringify(variables)
        );
        let newRecipes = data?.searchRecipesByIngredients?.edges.map(
          (recipe) => recipe.node
        );
        setRecipes(newRecipes);
      }
      setLoading(false);
    }
    get();
  }, [array]);
  return loading ? (
    <Loading />
  ) : (
    <>
      <Grid
        container
        spacing={2}
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}>
        <Grid
          item
          xs={1}
          display='flex'
          justifyContent={"flex-end"}
          alignContent='center'
          marginTop={"10px"}>
          <Badge
            badgeContent={array.length}
            color='primary'
            onClick={toggleDrawer(true)}
            style={{ cursor: "pointer" }}>
            <ReceiptLongIcon color='action' />
          </Badge>
        </Grid>
        <Grid item xs={7}>
          <TextField
            label='Ingredient'
            id='ingredient-textbox'
            size='small'
            fullWidth
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Grid>
        <Grid item xs={1} display='flex' justifyContent={"flex-start"}>
          <Fab
            color='primary'
            disabled={value.length < 2}
            aria-label='add'
            size='small'
            onClick={handleClick}>
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>
      <Grid
        container
        marginTop={"10px"}
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => {
            return <RecipeReviewCard key={uuidv4()} recipe={recipe} />;
          })
        ) : (
          <div>No recipe</div>
        )}
      </Grid>
      <Drawer
        anchor={"left"}
        open={drawerState}
        onClose={toggleDrawer(false)}
        style={{ textAlign: "center" }}>
        <h2 style={{ width: "300px" }}>Ingredient List</h2>
        {array.length === 0 ? (
          <div>No ingredients</div>
        ) : (
          <List ingredientList={array} deleteIngredient={deleteIngredient} />
        )}
      </Drawer>
    </>
  );
};

export default Recipes;
