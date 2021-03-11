import ApolloClient from "apollo-boost";
import Environment from "./Environment";

const client = new ApolloClient({
    uri: Environment.apiUrl
});

export default client;
