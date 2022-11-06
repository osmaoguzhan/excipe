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
import { requireAuth } from "../utils/requireAuth";
import _ from "lodash";
import { Button } from "@mui/material";
import Head from "next/head";

const Recipes = () => {
  const ingredients = useArray([]);
  const [drawerState, toggleDrawer] = useToggle(false);
  const [value, setValue] = useState("");
  const [recipes, setRecipes] = useState([]);
  const { loading, setLoading } = useLoading();
  const [pageInfo, setPageInfo] = useState({
    endCursor: "YXJyYXljb25uZWN0aW9uOjEw=",
    hasNextPage: true,
  });

  const handleClick = async (e) => {
    e.preventDefault();
    setValue("");
    setPageInfo({
      endCursor: "YXJyYXljb25uZWN0aW9uOjEw=",
      hasNextPage: true,
    });
    if (
      ingredients.value.find((x) => value.toLowerCase() === x.toLowerCase())
    ) {
      Swal.fire({
        title: "Error!",
        text: "Ingredient is on the list already.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      ingredients.push(value);
    }
  };

  const deleteIngredient = async (e, ingredient) => {
    if (ingredients.length() === 1) {
      setRecipes([]);
    }
    ingredients.remove(ingredients.value.indexOf(ingredient));
  };

  const getRecipes = async () => {
    if (ingredients.length() > 0) {
      const variables = {
        list: ingredients.value,
        after: pageInfo.endCursor,
      };
      const data = await graphqlClient.request(
        RECIPES,
        JSON.stringify(variables)
      );
      let newRecipes = data?.searchRecipesByIngredients?.edges.map(
        (recipe) => recipe.node
      );
      if (scroll) {
        setRecipes((prev) => [...prev, ...newRecipes]);
      } else {
        setRecipes(newRecipes);
      }
      setPageInfo((prev) => {
        return { ...prev, ...data?.searchRecipesByIngredients.pageInfo };
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getRecipes();
  }, [ingredients.value]);

  return (
    <div>
      <Head>
        <title>Recipes</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      {loading ? (
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
                badgeContent={ingredients.length()}
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
            <Grid
              item
              xs={1}
              display='flex'
              justifyContent={"flex-start"}
              md={"auto"}>
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
            item
            container
            marginTop={"10px"}
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}>
            {recipes.length > 0 ? (
              recipes.map((recipe) => {
                return <RecipeReviewCard key={uuidv4()} recipe={recipe} />;
              })
            ) : (
              <div style={{ marginLeft: "50%" }}>No recipe</div>
            )}
          </Grid>
          <Button
            style={{
              bottom: "100%",
              left: "50%",
              display: ingredients.length() > 0 ? "flex" : "none",
              justifyContent: "center",
              marginTop: "15px",
            }}
            onClick={() => getRecipes()}
            variant='outlined'>
            Load More
          </Button>
          <Drawer
            anchor={"left"}
            open={drawerState}
            onClose={toggleDrawer(false)}
            style={{ textAlign: "center" }}>
            <h2 style={{ width: "300px" }}>Ingredient List</h2>
            {ingredients.length() === 0 ? (
              <div>No ingredients</div>
            ) : (
              <List
                ingredientList={ingredients.value}
                deleteIngredient={deleteIngredient}
              />
            )}
          </Drawer>
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  return requireAuth(ctx, () => {
    return {
      props: {
        data: null,
      },
    };
  });
};

export default Recipes;
