import React from "react";
import { Provider } from "react-redux";
import GlobalStyles from "./assets/styles/globalStyle";
import { store } from "./redux/store";
import Boot from "./redux/boot";
import Routes from "./router";
import AppProvider from "./AppProvider";
import { SecurityContextProvider } from "./contexts/security.context";
import moment from "moment";
import "moment/locale/es-us";
import { ApolloProvider } from "@apollo/react-hooks";
import { apolloClient } from "./graphql/apollo-client";
import Environment from "./env/env";

console.log(process.env.REACT_APP_ENV, Environment());
const App = () => {
    moment.locale("es-US");
    return (
        <ApolloProvider client={apolloClient}>
            <SecurityContextProvider>
                <Provider store={store}>
                    <AppProvider>
                        <>
                            <GlobalStyles />
                            <Routes />
                        </>
                    </AppProvider>
                </Provider>
            </SecurityContextProvider>
        </ApolloProvider>
    );
};
Boot()
    .then(() => App())
    .catch(error => console.error(error));

export default App;
