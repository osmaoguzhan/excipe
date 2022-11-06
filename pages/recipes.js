import { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
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
import { ArrowDownward } from "@mui/icons-material";

const Recipes = () => {
  const { array, push, remove } = useArray([]);
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
      setRecipes([]);
    }
    remove(array.indexOf(ingredient));
  };

  const getRecipes = async () => {
    if (array.length > 0) {
      const variables = {
        list: array,
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
          display: array.length > 0 ? "flex" : "none",
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
        {array.length === 0 ? (
          <div>No ingredients</div>
        ) : (
          <List ingredientList={array} deleteIngredient={deleteIngredient} />
        )}
      </Drawer>
    </>
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
