import { gql } from "graphql-request";

export const RECIPES = gql`
  query ($listOfIngredients: [String]) {
    searchRecipesByIngredients(mustIngredients: $listOfIngredients) {
      edges {
        node {
          name
          ingredients {
            name
          }
          totalTime
          ingredientLines
          relativeCalories {
            carbs
            fat
            protein
            fat
          }
          nutrientsPerServing {
            calories
            sugar
          }
          mainImage
          instructions
        }
      }
    }
  }
`;
