import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f5e871",
  padding: "5px",
  textAlign: "center",
  width: "100%",
}));

const List = ({ ingredientList, deleteIngredient }) => {
  if (ingredientList === undefined || ingredientList?.length === 0) {
    return <></>;
  }
  return (
    <Stack
      style={{
        display: "flex",
        backgroundColor: "#f5e871",
      }}>
      {ingredientList?.map((ingredient) => {
        return (
          <Item key={uuidv4()}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <RemoveIcon
                  style={{
                    transform: "rotate(90deg)",
                    height: "40px",
                    color: "red",
                  }}
                />
              </Grid>
              <Grid xs={8} item className={"dancingScript"}>
                {ingredient}
              </Grid>
              <Grid
                item
                xs={2}
                display={"flex"}
                justifyContent={"flex-start"}
                alignItems={"center"}>
                <DeleteIcon
                  onClick={(e) => deleteIngredient(e, ingredient)}
                  style={{ cursor: "pointer" }}
                />
              </Grid>
            </Grid>
          </Item>
        );
      })}
    </Stack>
  );
};

export default List;
