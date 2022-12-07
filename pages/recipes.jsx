import { useEffect, useState } from "react";
import Head from "next/head";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import {
  Button,
  Drawer,
  Badge,
  Fab,
  Grid,
  TextField,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import List from "@/components/list";
import RecipeReviewCard from "@/components/card";
import Loading from "@/components/loading";
import graphqlClient from "@/graphql/graphqlClient";
import { RECIPES } from "@/graphql/queries";
import useArray from "@/hooks/useArray";
import useToggle from "@/hooks/useToggle";
import { useLoading } from "@/contexts/loadingContext";
import { requireAuth } from "@/utils/requireAuth";
import Notification from "@/components/notification";

const Recipes = ({ data, session, fridge }) => {
  const ingredients = useArray(data ? [...data] : []);
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
      setRecipes((prev) => [...prev, ...newRecipes]);
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
    <Box component={"div"} sx={{ maxWidth: "100%", overflowX: "clip" }}>
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
            <Grid item xs={1} color='red' md={"auto"}>
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
            display='flex'
            justifyContent='space-evenly'>
            {recipes.length > 0 ? (
              recipes.map((recipe) => {
                return <RecipeReviewCard key={uuidv4()} recipe={recipe} />;
              })
            ) : (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  textAlign: "center",
                  marginTop: "15px",
                }}>
                No recipe
              </div>
            )}
          </Grid>
          <Button
            style={{
              display: ingredients.length() > 0 ? "flex" : "none",
              position: "relative",
              textAlign: "center",
              margin: "auto",
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
      <Notification
        expiredInfo={fridge.filter((x) => x.status === "Expired")}
      />
    </Box>
  );
};

export const getServerSideProps = async (ctx) => {
  return requireAuth(ctx, async (session) => {
    const { success, data } = await (
      await fetch(`${process.env.NEXTAUTH_URL}/api/ingredient`, {
        headers: {
          userid: session._id,
        },
      })
    ).json();
    return {
      props: {
        data: "ingredients" in ctx.query ? ctx.query.ingredients : null,
        session: session,
        fridge: success ? data : null,
      },
    };
  });
};

export default Recipes;
