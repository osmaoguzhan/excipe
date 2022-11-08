import { GraphQLClient } from "graphql-request";

const endpoint = process.env.ENDPOINT;
const graphqlClient = new GraphQLClient(endpoint);
graphqlClient.setHeader("authorization", process.env.TOKEN);

export default graphqlClient;
