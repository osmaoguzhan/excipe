import { gql } from "graphql-request";

export const RECIPES = gql`
  query ($list: [String], $after: String) {
    searchRecipesByIngredients(
      mustIngredients: $list
      first: 6
      after: $after
    ) {
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
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
